import { AgEvent } from "../events";
import { Column } from "./column";
import { IEventEmitter } from "../interfaces/iEventEmitter";
import { DetailGridInfo } from "../gridApi";
import { IServerSideStore } from "../interfaces/IServerSideStore";
import { Beans } from "../rendering/beans";
export interface SetSelectedParams {
    newValue: boolean;
    clearSelection?: boolean;
    suppressFinishActions?: boolean;
    rangeSelect?: boolean;
    groupSelectsFiltered?: boolean;
}
export interface RowNodeEvent extends AgEvent {
    node: RowNode;
}
export interface DataChangedEvent extends RowNodeEvent {
    oldData: any;
    newData: any;
    update: boolean;
}
export interface CellChangedEvent extends RowNodeEvent {
    column: Column;
    newValue: any;
    oldValue: any;
}
export declare enum RowHighlightPosition {
    Above = 0,
    Below = 1
}
export declare class RowNode implements IEventEmitter {
    static ID_PREFIX_ROW_GROUP: string;
    static ID_PREFIX_TOP_PINNED: string;
    static ID_PREFIX_BOTTOM_PINNED: string;
    private static OBJECT_ID_SEQUENCE;
    static EVENT_ROW_SELECTED: string;
    static EVENT_DATA_CHANGED: string;
    static EVENT_CELL_CHANGED: string;
    static EVENT_ALL_CHILDREN_COUNT_CHANGED: string;
    static EVENT_MASTER_CHANGED: string;
    static EVENT_GROUP_CHANGED: string;
    static EVENT_MOUSE_ENTER: string;
    static EVENT_MOUSE_LEAVE: string;
    static EVENT_HEIGHT_CHANGED: string;
    static EVENT_TOP_CHANGED: string;
    static EVENT_DISPLAYED_CHANGED: string;
    static EVENT_FIRST_CHILD_CHANGED: string;
    static EVENT_LAST_CHILD_CHANGED: string;
    static EVENT_CHILD_INDEX_CHANGED: string;
    static EVENT_ROW_INDEX_CHANGED: string;
    static EVENT_EXPANDED_CHANGED: string;
    static EVENT_HAS_CHILDREN_CHANGED: string;
    static EVENT_SELECTABLE_CHANGED: string;
    static EVENT_UI_LEVEL_CHANGED: string;
    static EVENT_HIGHLIGHT_CHANGED: string;
    static EVENT_DRAGGING_CHANGED: string;
    /** Unique ID for the node. Either provided by the application, or generated by the grid if not. */
    id: string | undefined;
    /** If using row grouping, contains the group values for this group. */
    groupData: {
        [key: string]: any | null;
    } | null;
    /** If using row grouping and aggregation, contains the aggregation data. */
    aggData: any;
    /** The data as provided by the application. */
    data: any;
    /** The parent node to this node, or empty if top level */
    parent: RowNode | null;
    /** How many levels this node is from the top when grouping. */
    level: number;
    /** How many levels this node is from the top when grouping in the UI (only different to `parent` when `groupRemoveSingleChildren=true`)*/
    uiLevel: number;
    /**
     * If doing in-memory (client-side) grouping, this is the index of the group column this cell is for.
     * This will always be the same as the level, unless we are collapsing groups, i.e. `groupRemoveSingleChildren=true`.
     */
    rowGroupIndex: number | null;
    /** `true` if this node is a group node (ie has children) */
    group: boolean | undefined;
    /** `true` if this row is getting dragged */
    dragging: boolean;
    /** `true` if this row is a master row, part of master / detail (ie row can be expanded to show detail) */
    master: boolean;
    /** `true` if this row is a detail row, part of master / detail (ie child row of an expanded master row)*/
    detail: boolean;
    /** If this row is a master row that was expanded, this points to the associated detail row. */
    detailNode: RowNode;
    /** If master detail, this contains details about the detail grid */
    detailGridInfo: DetailGridInfo | null;
    /** `true` if this node is a group and the group is the bottom level in the tree. */
    leafGroup: boolean;
    /** `true` if this is the first child in this group. Changes when data is sorted. */
    firstChild: boolean;
    /** `true` if this is the last child in this group. Changes when data is sorted. */
    lastChild: boolean;
    /** Index of this row with respect to its parent when grouping. Changes when data is sorted. */
    childIndex: number;
    /** The current row index. If the row is filtered out or in a collapsed group, this value will be `null`. */
    rowIndex: number | null;
    /** Either 'top' or 'bottom' if row pinned, otherwise `undefined` or `null`. */
    rowPinned: string;
    /** If using quick filter, stores a string representation of the row for searching against. */
    quickFilterAggregateText: string | null;
    /** `true` if row is a footer. Footers have `group = true` and `footer = true`. */
    footer: boolean;
    /** The field we are grouping on eg 'country'. */
    field: string | null;
    /** The row group column used for this group, e.g. the Country column instance. */
    rowGroupColumn: Column | null;
    /** The key for the group eg Ireland, UK, USA */
    key: string | null;
    /** Used by server-side row model. `true` if this row node is a stub. A stub is a placeholder row with loading icon while waiting from row to be loaded. */
    stub: boolean;
    /** Used by server side row model, true if this row node failed a load */
    failedLoad: boolean;
    /** All lowest level nodes beneath this node, no groups. */
    allLeafChildren: RowNode[];
    /** Children of this group. If multi levels of grouping, shows only immediate children. */
    childrenAfterGroup: RowNode[] | null;
    /** Filtered children of this group. */
    childrenAfterFilter: RowNode[] | null;
    /** Aggregated and re-filtered children of this group. */
    childrenAfterAggFilter: RowNode[] | null;
    /** Sorted children of this group. */
    childrenAfterSort: RowNode[] | null;
    /** Number of children and grand children. */
    allChildrenCount: number | null;
    /** Children mapped by the pivot columns. */
    childrenMapped: {
        [key: string]: any;
    } | null;
    /** Server Side Row Model Only - the children are in an infinite cache. */
    childStore: IServerSideStore | null;
    /** `true` if group is expanded, otherwise `false`. */
    expanded: boolean;
    /** If using footers, reference to the footer node for this group. */
    sibling: RowNode;
    /** The height, in pixels, of this row */
    rowHeight: number | null | undefined;
    /** Dynamic row heights are done on demand, only when row is visible. However for row virtualisation
     * we need a row height to do the 'what rows are in viewport' maths. So we assign a row height to each
     * row based on defaults and rowHeightEstimated=true, then when the row is needed for drawing we do
     * the row height calculation and set rowHeightEstimated=false.*/
    rowHeightEstimated: boolean;
    /**
     * This will be `true` if it has a rowIndex assigned, otherwise `false`.
     */
    displayed: boolean;
    /** The row top position in pixels. */
    rowTop: number | null;
    /** The top pixel for this row last time, makes sense if data set was ordered or filtered,
     * it is used so new rows can animate in from their old position. */
    oldRowTop: number | null;
    /** `true` if this node is a daemon. This means row is not part of the model. Can happen when then
     * the row is selected and then the user sets a different ID onto the node. The nodes is then
     * representing a different entity, so the selection controller, if the node is selected, takes
     * a copy where daemon=true. */
    daemon: boolean;
    /** `true` by default - can be overridden via gridOptions.isRowSelectable(rowNode) */
    selectable: boolean;
    /** Used by the value service, stores values for a particular change detection turn. */
    __cacheData: {
        [colId: string]: any;
    };
    __cacheVersion: number;
    /** Used by sorting service - to give deterministic sort to groups. Previously we
     * just id for this, however id is a string and had slower sorting compared to numbers. */
    __objectId: number;
    /** We cache the result of hasChildren() so that we can be aware of when it has changed, and hence
     * fire the event. Really we should just have hasChildren as an attribute and do away with hasChildren()
     * method, however that would be a breaking change. */
    private __hasChildren;
    /** When one or more Columns are using autoHeight, this keeps track of height of each autoHeight Cell,
     * indexed by the Column ID. */
    private __autoHeights?;
    /** `true` when nodes with the same id are being removed and added as part of the same batch transaction */
    alreadyRendered: boolean;
    highlighted: RowHighlightPosition | null;
    private selected;
    private eventService;
    private beans;
    private checkAutoHeightsDebounced;
    private onRowHeightChangedDebounced;
    constructor(beans: Beans);
    /** Replaces the data on the `rowNode`. When complete, the grid will refresh the the entire rendered row if it is showing. */
    setData(data: any): void;
    updateData(data: any): void;
    private setDataCommon;
    private updateDataOnDetailNode;
    private createDataChangedEvent;
    private createLocalRowEvent;
    getRowIndexString(): string;
    private createDaemonNode;
    setDataAndId(data: any, id: string | undefined): void;
    private checkRowSelectable;
    setRowSelectable(newVal: boolean): void;
    setId(id?: string): void;
    getGroupKeys(excludeSelf?: boolean): string[];
    isPixelInRange(pixel: number): boolean;
    setFirstChild(firstChild: boolean): void;
    setLastChild(lastChild: boolean): void;
    setChildIndex(childIndex: number): void;
    setRowTop(rowTop: number | null): void;
    clearRowTopAndRowIndex(): void;
    private setDisplayed;
    setDragging(dragging: boolean): void;
    setHighlighted(highlighted: RowHighlightPosition | null): void;
    setAllChildrenCount(allChildrenCount: number | null): void;
    setMaster(master: boolean): void;
    setGroup(group: boolean): void;
    /**
     * Sets the row height.
     * Call if you want to change the height initially assigned to the row.
     * After calling, you must call `api.onRowHeightChanged()` so the grid knows it needs to work out the placement of the rows. */
    setRowHeight(rowHeight: number | undefined | null, estimated?: boolean): void;
    setRowAutoHeight(cellHeight: number | undefined, column: Column): void;
    checkAutoHeights(): void;
    /** This method is debounced. It is used for row auto-height. If we don't debounce,
     * then the Row Models will end up recalculating each row position
     * for each row height change and result in the Row Renderer laying out rows.
     * This is particularly bad if using print layout, and showing eg 1,000 rows,
     * each row will change it's height, causing Row Model to update 1,000 times.
     */
    private onRowHeightChanged;
    setRowIndex(rowIndex: number | null): void;
    setUiLevel(uiLevel: number): void;
    setExpanded(expanded: boolean, e?: MouseEvent | KeyboardEvent): void;
    private createGlobalRowEvent;
    private dispatchLocalEvent;
    /**
     * Replaces the value on the `rowNode` for the specified column. When complete,
     * the grid will refresh the rendered cell on the required row only.
     *
     * @param colKey The column where the value should be updated
     * @param newValue The new value
     * @param eventSource The source of the event
     * @returns `True` if the value was changed, otherwise `False`.
     */
    setDataValue(colKey: string | Column, newValue: any, eventSource?: string): boolean;
    setGroupValue(colKey: string | Column, newValue: any): void;
    setAggData(newAggData: any): void;
    updateHasChildren(): void;
    hasChildren(): boolean;
    isEmptyRowGroupNode(): boolean | undefined;
    private dispatchCellChangedEvent;
    /**
     * The first time `quickFilter` runs, the grid creates a one-off string representation of the row.
     * This string is then used for the quick filter instead of hitting each column separately.
     * When you edit, using grid editing, this string gets cleared down.
     * However if you edit without using grid editing, you will need to clear this string down for the row to be updated with the new values.
     * Otherwise new values will not work with the `quickFilter`. */
    resetQuickFilterAggregateText(): void;
    isExpandable(): boolean;
    /** Returns:
     * - `true` if node is selected,
     * - `false` if the node isn't selected
     * - `undefined` if it's partially selected (group where not all children are selected). */
    isSelected(): boolean | undefined;
    /** Perform a depth-first search of this node and its children. */
    depthFirstSearch(callback: (rowNode: RowNode) => void): void;
    calculateSelectedFromChildren(): void;
    setSelectedInitialValue(selected: boolean): void;
    /**
     * Select (or deselect) the node.
     * @param newValue -`true` for selection, `false` for deselection.
     * @param clearSelection - If selecting, then passing `true` will select the node exclusively (i.e. NOT do multi select). If doing deselection, `clearSelection` has no impact.
     * @param suppressFinishActions - Pass `true` to prevent the `selectionChanged` from being fired. Note that the `rowSelected` event will still be fired.
     */
    setSelected(newValue: boolean, clearSelection?: boolean, suppressFinishActions?: boolean): void;
    isRowPinned(): boolean;
    setSelectedParams(params: SetSelectedParams): number;
    private doRowRangeSelection;
    isParentOfNode(potentialParent: RowNode): boolean;
    selectThisNode(newValue?: boolean): boolean;
    private selectChildNodes;
    /** Add an event listener. */
    addEventListener(eventType: string, listener: Function): void;
    /** Remove event listener. */
    removeEventListener(eventType: string, listener: Function): void;
    onMouseEnter(): void;
    onMouseLeave(): void;
    getFirstChildOfFirstChild(rowGroupColumn: Column | null): RowNode | null;
    isFullWidthCell(): boolean;
    /**
     * Returns the route of the row node. If the Row Node is a group, it returns the route to that Row Node.
     * If the Row Node is not a group, it returns `undefined`.
     */
    getRoute(): string[] | undefined;
}
