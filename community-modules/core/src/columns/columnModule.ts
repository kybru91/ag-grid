import type { _ColumnGridApi } from '../api/gridApi';
import { _defineModule } from '../interfaces/iModule';
import { VERSION } from '../version';
import {
    applyColumnState,
    autoSizeAllColumns,
    autoSizeColumn,
    autoSizeColumns,
    getAllDisplayedColumnGroups,
    getAllDisplayedColumns,
    getAllDisplayedVirtualColumns,
    getAllGridColumns,
    getCenterDisplayedColumnGroups,
    getColumn,
    getColumnDef,
    getColumnDefs,
    getColumnGroup,
    getColumnGroupState,
    getColumnState,
    getColumns,
    getDisplayNameForColumn,
    getDisplayNameForColumnGroup,
    getDisplayedCenterColumns,
    getDisplayedColAfter,
    getDisplayedColBefore,
    getDisplayedLeftColumns,
    getDisplayedRightColumns,
    getLeftDisplayedColumnGroups,
    getProvidedColumnGroup,
    getRightDisplayedColumnGroups,
    isPinning,
    isPinningLeft,
    isPinningRight,
    moveColumn,
    moveColumnByIndex,
    moveColumns,
    resetColumnGroupState,
    resetColumnState,
    setColumnGroupOpened,
    setColumnGroupState,
    setColumnPinned,
    setColumnVisible,
    setColumnWidth,
    setColumnWidths,
    setColumnsPinned,
    setColumnsVisible,
    sizeColumnsToFit,
} from './columnApi';
import { DataTypeService } from './dataTypeService';

export const DataTypeModule = _defineModule({
    version: VERSION,
    moduleName: '@ag-grid-community/data-type',
    beans: [DataTypeService],
});

export const ColumnApiModule = _defineModule<_ColumnGridApi>({
    version: VERSION,
    moduleName: '@ag-grid-community/column-api',
    apiFunctions: {
        getColumnDef,
        getColumnDefs,
        sizeColumnsToFit,
        setColumnGroupOpened,
        getColumnGroup,
        getProvidedColumnGroup,
        getDisplayNameForColumn,
        getDisplayNameForColumnGroup,
        getColumn,
        getColumns,
        applyColumnState,
        getColumnState,
        resetColumnState,
        getColumnGroupState,
        setColumnGroupState,
        resetColumnGroupState,
        isPinning,
        isPinningLeft,
        isPinningRight,
        getDisplayedColAfter,
        getDisplayedColBefore,
        setColumnVisible,
        setColumnsVisible,
        setColumnPinned,
        setColumnsPinned,
        getAllGridColumns,
        getDisplayedLeftColumns,
        getDisplayedCenterColumns,
        getDisplayedRightColumns,
        getAllDisplayedColumns,
        getAllDisplayedVirtualColumns,
        moveColumn,
        moveColumnByIndex,
        moveColumns,
        setColumnWidth,
        setColumnWidths,
        getLeftDisplayedColumnGroups,
        getCenterDisplayedColumnGroups,
        getRightDisplayedColumnGroups,
        getAllDisplayedColumnGroups,
        autoSizeColumn,
        autoSizeColumns,
        autoSizeAllColumns,
    },
});
