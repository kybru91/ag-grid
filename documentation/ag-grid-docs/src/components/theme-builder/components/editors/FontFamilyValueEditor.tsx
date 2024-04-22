import styled from '@emotion/styled';

import { paramValueToCss } from '../../../../../../../community-modules/theming/src/theme-types';
import { Select } from './Select';
import type { ValueEditorProps } from './ValueEditorProps';

export const FontFamilyValueEditor = ({ param, value, onChange }: ValueEditorProps) => {
    const options = param.property === 'fontFamily' ? topLevelOptions : subLevelOptions;
    const selectedOption = options.find((o) => o.value === value) || options[0];

    return (
        <Select
            options={options}
            value={selectedOption}
            onChange={(newValue) => onChange(newValue.value)}
            renderItem={(o) => {
                const font = paramValueToCss('fontFamily', o.value);
                return (
                    <FontItem style={{ fontFamily: typeof font === 'string' ? font : undefined }}>{o.label}</FontItem>
                );
            }}
        />
    );
};

const FontItem = styled('span')``;

const fontOptions = [
    {
        label: 'System',
        value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    },
    {
        label: 'Arial',
        value: '"Arial" , sans-serif',
    },
    {
        label: 'Inter',
        value: 'google:Inter',
    },
    {
        label: 'IBM Plex Sans',
        value: 'google:IBM Plex Sans',
    },
    {
        label: 'IBM Plex Mono',
        value: 'google:IBM Plex Mono',
    },
    {
        label: 'Roboto',
        value: 'google:Roboto',
    },
    {
        label: 'Times New Roman',
        value: 'Times New Roman',
    },
    {
        label: 'Inclusive Sans',
        value: 'google:Inclusive Sans',
    },
    {
        label: 'Open Sans',
        value: 'google:Open Sans',
    },
    {
        label: 'Lato',
        value: 'google:Lato',
    },
    {
        label: 'Jacquard 24',
        value: 'google:Jacquard 24',
    },
];
const topLevelOptions = [{ label: 'Same as application', value: 'inherit' }, ...fontOptions];
const subLevelOptions = [{ label: 'Unchanged', value: 'inherit' }, ...fontOptions];

export const PreloadFontSelection = () => {
    // const fontUrls = fontOptions
    //     .map(({ value }) => value)
    //     .filter((v) => String(v).startsWith('google:'))
    //     .map((v) => String(v).replace('google:', ''))
    //     .sort()
    //     .map(
    //         (font) =>
    //             `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@100;200;300;400;500;600;700&display=swap');`
    //     );
    // return (
    //     <>
    //         {fontUrls.map((url) => (
    //             <link rel="stylesheet" href={url} />
    //         ))}
    //     </>
    // );
    const css = fontOptions
        .map(({ value }) => value)
        .filter((v) => String(v).startsWith('google:'))
        .map((v) => String(v).replace('google:', ''))
        .sort()
        .map(
            (font) =>
                `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@100;200;300;400;500;600;700&display=swap');`
        )
        .join('\n');
    return <style>{css}</style>;
};
