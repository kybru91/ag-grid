import 'ag-grid-community';
import { BeanStub } from 'ag-grid-community';
import type { AgColumn, AgColumnGroup, IHeaderCellComp } from 'ag-grid-community';

export class RangeHeaderHighlightFeature extends BeanStub {
    private columnMap: Map<AgColumn, boolean> = new Map();
    constructor(
        private column: AgColumn | AgColumnGroup,
        private comp: IHeaderCellComp
    ) {
        super();
        this.resetColumnMap();
    }

    public postConstruct(): void {
        this.setupRangeHeaderHighlight();
        this.addManagedEventListeners({
            columnMoved: () => this.onRangeSelectionChanged(),
            columnGroupOpened: () => this.onRangeSelectionChanged(),
        });
    }

    private resetColumnMap(): void {
        this.columnMap.clear();

        let columns: AgColumn[] | null;
        if (this.column.isColumn) {
            columns = [this.column];
        } else {
            columns = this.column.getDisplayedLeafColumns();
        }

        for (const column of columns) {
            this.columnMap.set(column, false);
        }
    }

    private setupRangeHeaderHighlight(): void {
        const { gos, rangeSvc } = this.beans;
        const selection = gos.get('cellSelection');

        if (!selection || !rangeSvc || typeof selection !== 'object' || !selection.enableHeaderHighlight) {
            return;
        }

        this.addManagedEventListeners({
            rangeSelectionChanged: this.onRangeSelectionChanged.bind(this),
            columnPinned: this.onRangeSelectionChanged.bind(this),
        });
    }

    public onRangeSelectionChanged(): void {
        this.resetColumnMap();

        const ranges = this.beans.rangeSvc!.getCellRanges();
        let hasRange = false;
        let isAllColumnRange = true;

        for (const range of ranges) {
            if (hasRange) {
                break;
            }

            for (const column of range.columns) {
                if (this.columnMap.has(column as AgColumn)) {
                    this.columnMap.set(column as AgColumn, true);
                    hasRange ||= true;
                }
            }
        }

        for (const value of Array.from(this.columnMap.values())) {
            if (value === false) {
                isAllColumnRange = false;
                break;
            }
        }

        this.comp.addOrRemoveCssClass('ag-header-range-highlight', hasRange && isAllColumnRange);
    }

    public override destroy(): void {
        super.destroy();
        (this.comp as any) = null;
        (this.column as any) = null;
    }
}
