import type { RowNode } from '../entities/rowNode';

export interface IFooterService {
    addNodes(
        startIndex: number,
        nodes: RowNode[],
        callback: (node: RowNode, index: number) => void,
        includeFooterNodes: boolean,
        rootNode: RowNode | null,
        position: 'top' | 'bottom'
    ): number;

    getTopDisplayIndex(
        rowsToDisplay: RowNode[],
        topLevelIndex: number,
        childrenAfterSort: RowNode[],
        getDefaultIndex: (adjustedIndex: number) => number
    ): number;
}
