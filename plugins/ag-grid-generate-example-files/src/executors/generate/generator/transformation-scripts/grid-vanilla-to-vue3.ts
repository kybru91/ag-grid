import * as JSON5 from 'json5';

import type { ExampleConfig, ParsedBindings } from '../types';
import {
    GRID_WIDE_COMPONENTS,
    OVERRIDABLE_AG_COMPONENTS,
    convertDefaultColDef,
    getColumnDefs,
    getTemplate,
    isComponent,
    isExternalVueFile,
} from './grid-vanilla-to-vue-common';
import {
    addBindingImports,
    addGenericInterfaceImport,
    addLicenseManager,
    addRelativeImports,
    convertFunctionToConstProperty,
    convertFunctionToConstPropertyTs,
    findLocaleImport,
    getFunctionName,
    getIntegratedDarkModeCode,
    getPropertyInterfaces,
    handleRowGenericInterface,
    isInstanceMethod,
    preferParamsApi,
    replaceGridReadyRowData,
} from './parser-utils';
import {
    getImport,
    quoteVueComponents,
    toAssignment,
    toConst,
    toInput,
    toMemberWithType,
    toOutput,
    toRef,
} from './vue-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

function getOnGridReadyCode(bindings: ParsedBindings): string {
    const { onGridReady, data } = bindings;
    const additionalLines = [];

    if (onGridReady) {
        additionalLines.push(onGridReady.trim().replace(/^\{|\}$/g, ''));
    }

    if (data) {
        const { url, callback } = data;

        const setRowDataBlock = replaceGridReadyRowData(callback, 'rowData.value');

        additionalLines.push(`
            const updateData = (data) => ${setRowDataBlock};
            
            fetch(${url})
                .then(resp => resp.json())
                .then(data => updateData(data));`);
    }

    const additional = preferParamsApi(
        additionalLines.length > 0 ? `\n\n        ${additionalLines.join('\n        ')}` : ''
    );
    return `const onGridReady = (params) => {
        ${getIntegratedDarkModeCode(bindings.exampleName)}
        gridApi.value = params.api;
        ${additional}
    }`;
}

const replaceApiThisReference = (code) => code.replaceAll('gridApi', 'gridApi.value');

function getAllMethods(bindings: ParsedBindings): [string[], string[], string[], string[], string[]] {
    const eventHandlers = bindings.eventHandlers
        .filter((event) => event.name != 'onGridReady')
        .map((event) => event.handler)
        .map(replaceApiThisReference)
        .map(convertFunctionToConstPropertyTs);

    const externalEventHandlers = bindings.externalEventHandlers
        .map((event) => event.body)
        .map(replaceApiThisReference)
        .map(convertFunctionToConstPropertyTs);
    const instanceMethods = bindings.instanceMethods.map(replaceApiThisReference).map(convertFunctionToConstPropertyTs);

    const utilFunctions = bindings.utils
        .map((body) => {
            const funcName = getFunctionName(body);

            if (funcName) {
                return `window.${funcName} = ${body}`;
            }

            // probably a var
            return body;
        })
        .sort((a, b) => {
            const aIsAssignedToWindow = a.startsWith('window.');
            const bIsAssignedToWindow = b.startsWith('window.');

            if (aIsAssignedToWindow && bIsAssignedToWindow) {
                return 0;
            }
            if (aIsAssignedToWindow) {
                return -1;
            }
            if (bIsAssignedToWindow) {
                return 1;
            }

            return 0;
        });

    const functionNames = bindings.eventHandlers
        .map((event) => event.handlerName)
        .concat(bindings.externalEventHandlers.map((event) => event.name))
        .concat(bindings.instanceMethods.map(getFunctionName));

    return [eventHandlers, externalEventHandlers, instanceMethods, utilFunctions, functionNames];
}

function getPropertyBindings(
    bindings: ParsedBindings,
    rowDataType: string,
    componentFileNames: string[],
    vueComponents
): [string[], string[], string[], string[], string[]] {
    const propertyAssignments = [];
    const propertyVars = [];
    const propertyAttributes = [];
    const propertyNames = [];

    bindings.properties
        .filter((property) => property.name !== 'onGridReady')
        .forEach((property) => {
            if (componentFileNames.length > 0 && property.name === 'components') {
                if (bindings.components) {
                    const userAgComponents = OVERRIDABLE_AG_COMPONENTS.filter((agComponentName) =>
                        bindings.components.some(
                            (component) =>
                                component.name === agComponentName &&
                                !vueComponents.some((existingComp) => existingComp.includes(agComponentName))
                        )
                    ).map((agComponentName) => `${agComponentName}: '${agComponentName}'`);

                    vueComponents.push(...userAgComponents);
                }
            } else if (property.value === 'true' || property.value === 'false') {
                propertyAttributes.push(toConst(property));
            } else if (property.value === null || property.value === 'null') {
                propertyAttributes.push(toInput(property));
                propertyNames.push(property.name);
            } else if (property.name === 'groupRowRendererParams') {
                const perLine = property.value.split('\n');
                const result = [];
                perLine.forEach((line) => {
                    if (line.includes('innerRenderer')) {
                        const component = line.match(/.*:\s*(.*),/)
                            ? line.match(/.*:\s*(.*),/)[1]
                            : line.match(/.*:\s*(.*)$/)[1];
                        line = line.replace(component, `'${component}'`);
                        result.push(line);

                        if (!vueComponents.includes(component)) {
                            vueComponents.push(component);
                        }
                    } else {
                        result.push(line);
                    }
                });
                const newValue = result.join('\n');

                propertyAttributes.push(toInput(property));

                propertyVars.push(toMemberWithType(property, componentFileNames));
                propertyAssignments.push(`${property.name}.value = ${newValue}`);
                propertyNames.push(property.name);
            } else if (GRID_WIDE_COMPONENTS.includes(property.name)) {
                const parsedValue = `${property.value.replace('AG_LITERAL_', '')}`;

                propertyAttributes.push(toInput(property));

                propertyVars.push(toMemberWithType(property, componentFileNames));
                propertyAssignments.push(`${property.name}.value = '${parsedValue}'`);
                propertyNames.push(property.name);
                if (isExternalVueFile(componentFileNames, parsedValue)) {
                    if (!vueComponents.includes(parsedValue)) {
                        vueComponents.push(parsedValue);
                    }
                }
            } else {
                propertyNames.push(property.name);

                // for when binding a method
                // see javascript-grid-keyboard-navigation for an example
                // tabToNextCell needs to be bound to the react component
                if (!isInstanceMethod(bindings.instanceMethods, property)) {
                    propertyAttributes.push(toInput(property));

                    if (property.name !== 'defaultColDef' && property.name !== 'autoGroupColumnDef') {
                        if (property.name === 'rowData') {
                            propertyVars.push(`const rowData = ref<${rowDataType}[]>(null)`);
                        } else {
                            propertyVars.push(toMemberWithType(property, componentFileNames));
                        }
                    }
                }

                if (property.name !== 'defaultColDef' && property.name !== 'autoGroupColumnDef') {
                    propertyAssignments.push(toAssignment(property, componentFileNames));
                }
            }
        });

    if (bindings.data && bindings.data.callback.indexOf("gridApi.setGridOption('rowData',") >= 0) {
        if (propertyAttributes.filter((item) => item.indexOf(':rowData') >= 0).length === 0) {
            propertyAttributes.push(':rowData="rowData"');
            propertyNames.push('rowData');
        }

        if (propertyVars.filter((item) => item.indexOf('rowData') >= 0).length === 0) {
            propertyVars.push(`const rowData = ref<${rowDataType}[]>(null)`);
        }
    }

    return [propertyAssignments, propertyVars, propertyAttributes, vueComponents, propertyNames];
}

function getModuleImports(
    bindings: ParsedBindings,
    exampleConfig: ExampleConfig,
    componentFileNames: string[],
    allStylesheets: string[]
): string[] {
    const { properties } = bindings;

    const imports = [
        "import { createApp, defineComponent, onBeforeMount, ref, shallowRef } from 'vue';",
        "import { AgGridVue } from 'ag-grid-vue3';",
    ];

    if (allStylesheets && allStylesheets.length > 0) {
        allStylesheets.forEach((styleSheet) => imports.push(`import './${path.basename(styleSheet)}';`));
    }

    const propertyInterfaces = getPropertyInterfaces(properties);
    const bImports = [...(bindings.imports || []).filter((entry) => !entry.module.includes('./'))];
    bImports.push({
        module: `'ag-grid-community'`,
        isNamespaced: false,
        imports: [...propertyInterfaces, 'GridReadyEvent', 'GridApi'],
    });

    addLicenseManager(imports, exampleConfig);

    if (bImports.length > 0) {
        addBindingImports(bImports, imports, true);
    }

    if (componentFileNames) {
        imports.push(...componentFileNames.map((componentFileName) => getImport(componentFileName, 'Vue', '')));
    }

    addRelativeImports(bindings, imports, 'js');

    return imports;
}

function getImports(
    bindings: ParsedBindings,
    exampleConfig: ExampleConfig,
    componentFileNames: string[],
    allStylesheets: string[]
): string[] {
    const imports = [];

    const localeImport = findLocaleImport(bindings.imports);
    if (localeImport) {
        imports.push(`import { ${localeImport.imports[0]} } from '@ag-grid-community/locale';`);
    }

    imports.push(...getModuleImports(bindings, exampleConfig, componentFileNames, allStylesheets));

    addGenericInterfaceImport(imports, bindings.tData, bindings);

    if (bindings.moduleRegistration) {
        imports.push(bindings.moduleRegistration);
    }

    return imports;
}

export function vanillaToVue3(
    bindings: ParsedBindings,
    exampleConfig: ExampleConfig,
    componentFileNames: string[],
    allStylesheets: string[]
): () => string {
    const vueComponents = bindings.components.map((component) => `${component.name}:${component.value}`);
    const rowDataType = bindings.tData || 'any';

    const onGridReady = getOnGridReadyCode(bindings);
    const eventAttributes = bindings.eventHandlers.filter((event) => event.name !== 'onGridReady').map(toOutput);
    const [eventHandlers, externalEventHandlers, instanceMethods, utilFunctions, functionNames] =
        getAllMethods(bindings);
    const defaultColDef = bindings.defaultColDef
        ? convertDefaultColDef(bindings.defaultColDef, vueComponents, componentFileNames)
        : null;
    const autoGroupColumnDef = bindings.autoGroupColumnDef
        ? convertDefaultColDef(bindings.autoGroupColumnDef, vueComponents, componentFileNames)
        : null;
    const genericParams = rowDataType !== 'any' ? `<${rowDataType}>` : '';

    return () => {
        const imports = getImports(bindings, exampleConfig, componentFileNames, allStylesheets);
        const [propertyAssignments, propertyVars, propertyAttributes, _, propertyNames] = getPropertyBindings(
            bindings,
            rowDataType,
            componentFileNames,
            vueComponents
        );
        const template = getTemplate(bindings, exampleConfig, propertyAttributes.concat(eventAttributes));

        return handleRowGenericInterface(
            `
${imports.join('\n')}
${exampleConfig.licenseKey ? "// enter your license key here to suppress console message and watermark\nLicenseManager.setLicenseKey('');\n" : ''}
${bindings.classes.join('\n')}

const VueExample = {
    template: \`
        <div style="height: 100%">
            ${template}
        </div>
    \`,
    components: {
        'ag-grid-vue': AgGridVue,
        ${vueComponents.join(',\n')}
    },
    setup(props) {
        const gridApi = shallowRef${genericParams}();
        ${defaultColDef ? `const defaultColDef = ref(${defaultColDef});` : ''}
        ${autoGroupColumnDef ? `const autoGroupColumnDef = ref(${autoGroupColumnDef});` : ''}
        ${propertyVars.join(';\n')}
        
        onBeforeMount(() => {
            ${propertyAssignments.join(';\n')}            
        });
        
        ${eventHandlers
            .concat(externalEventHandlers)
            .concat(onGridReady)
            .concat(instanceMethods)
            .map((snippet) => `${snippet.trim()};`)
            .join('\n')}
                
        return {
            gridApi,
            ${propertyNames.length > 0 ? propertyNames.join(',\n') + ',' : ''}
            onGridReady,
            ${functionNames ? functionNames.filter((functionName) => !propertyNames.includes(functionName)).join(',\n') : ''}
        }        
    }
}

createApp(VueExample)
    .mount("#app")

${utilFunctions.map((snippet) => `${snippet.trim()}`).join('\n\n')}

`,
            bindings.tData
        );
    };
}

if (typeof window !== 'undefined') {
    (<any>window).vanillaToVue3 = vanillaToVue3;
}
