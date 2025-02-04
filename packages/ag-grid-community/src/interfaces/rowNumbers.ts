import type { ColDef } from '../entities/colDef';

export interface RowNumbersOptions
    extends Pick<
        ColDef,
        | 'contextMenuItems'
        | 'context'
        | 'onCellClicked'
        | 'onCellContextMenu'
        | 'onCellDoubleClicked'
        | 'headerTooltip'
        | 'headerStyle'
        | 'headerComponent'
        | 'headerComponentParams'
        | 'suppressHeaderContextMenu'
        | 'suppressHeaderKeyboardEvent'
        | 'tooltipField'
        | 'tooltipValueGetter'
        | 'tooltipComponent'
        | 'tooltipComponentParams'
        | 'valueGetter'
        | 'valueFormatter'
        | 'width'
        | 'initialWidth'
        | 'maxWidth'
        | 'minWidth'
        | 'flex'
        | 'initialFlex'
        | 'resizable'
    > {
    /**
     * Set to `true` to prevent the automatic integration with Cell Selection
     */
    suppressCellSelectionIntegration?: boolean;
}
