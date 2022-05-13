import { Group } from "../../scene/group";
import { RangeHandle } from "./rangeHandle";
import { RangeMask } from "./rangeMask";
import { BBox } from "../../scene/bbox";
export declare class RangeSelector extends Group {
    static className: string;
    protected isContainerNode: boolean;
    private static defaults;
    readonly minHandle: RangeHandle;
    readonly maxHandle: RangeHandle;
    readonly mask: RangeMask;
    protected _x: number;
    set x(value: number);
    get x(): number;
    protected _y: number;
    set y(value: number);
    get y(): number;
    protected _width: number;
    set width(value: number);
    get width(): number;
    protected _height: number;
    set height(value: number);
    get height(): number;
    protected _min: number;
    set min(value: number);
    get min(): number;
    protected _max: number;
    set max(value: number);
    get max(): number;
    onRangeChange?: (min: number, max: number) => any;
    private updateHandles;
    computeBBox(): BBox;
    computeVisibleRangeBBox(): BBox;
    render(ctx: CanvasRenderingContext2D): void;
}
