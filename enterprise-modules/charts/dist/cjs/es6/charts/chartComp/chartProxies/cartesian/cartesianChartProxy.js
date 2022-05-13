"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chartProxy_1 = require("../chartProxy");
const ag_charts_community_1 = require("ag-charts-community");
class CartesianChartProxy extends chartProxy_1.ChartProxy {
    constructor(params) {
        super(params);
        this.axisTypeToClassMap = {
            number: ag_charts_community_1.NumberAxis,
            category: ag_charts_community_1.CategoryAxis,
            groupedCategory: ag_charts_community_1.GroupedCategoryAxis,
            time: ag_charts_community_1.TimeAxis
        };
    }
    updateAxes(params) {
        // when grouping recreate chart if the axis is not a 'groupedCategory', otherwise return
        if (params.grouping) {
            if (!(this.axisTypeToClassMap[this.xAxisType] === ag_charts_community_1.GroupedCategoryAxis)) {
                this.xAxisType = 'groupedCategory';
                this.recreateChart();
            }
            return;
        }
        // only update axis has changed and recreate the chart, i.e. switching from 'category' to 'time' axis
        const newXAxisType = CartesianChartProxy.isTimeAxis(params) ? 'time' : 'category';
        if (newXAxisType !== this.xAxisType) {
            this.xAxisType = newXAxisType;
            this.recreateChart();
        }
    }
    getAxesOptions(chartSeriesType = this.standaloneChartType) {
        return this.chartOptions[chartSeriesType].axes;
    }
    processDataForCrossFiltering(data, colId, params) {
        let yKey = colId;
        let atLeastOneSelectedPoint = false;
        if (this.crossFiltering) {
            data.forEach(d => {
                d[colId + '-total'] = d[colId] + d[colId + '-filtered-out'];
                if (d[colId + '-filtered-out'] > 0) {
                    atLeastOneSelectedPoint = true;
                }
            });
            const lastSelectedChartId = params.getCrossFilteringContext().lastSelectedChartId;
            if (lastSelectedChartId === params.chartId) {
                yKey = colId + '-total';
            }
        }
        return { yKey, atLeastOneSelectedPoint };
    }
    updateSeriesForCrossFiltering(series, colId, chart, params, atLeastOneSelectedPoint) {
        if (this.crossFiltering) {
            // special custom marker handling to show and hide points
            series.marker.enabled = true;
            series.marker.formatter = (p) => {
                return {
                    fill: p.highlighted ? 'yellow' : p.fill,
                    size: p.highlighted ? 12 : p.datum[colId] > 0 ? 8 : 0,
                };
            };
            chart.tooltip.delay = 500;
            // make line opaque when some points are deselected
            const ctx = params.getCrossFilteringContext();
            const lastSelectionOnThisChart = ctx.lastSelectedChartId === params.chartId;
            const deselectedPoints = lastSelectionOnThisChart && atLeastOneSelectedPoint;
            if (series instanceof ag_charts_community_1.AreaSeries) {
                series.fillOpacity = deselectedPoints ? 0.3 : 1;
            }
            if (series instanceof ag_charts_community_1.LineSeries) {
                series.strokeOpacity = deselectedPoints ? 0.3 : 1;
            }
            // add node click cross filtering callback to series
            series.addEventListener('nodeClick', this.crossFilterCallback);
        }
    }
    static isTimeAxis(params) {
        if (params.category && params.category.chartDataType) {
            return params.category.chartDataType === 'time';
        }
        const testDatum = params.data[0];
        return (testDatum && testDatum[params.category.id]) instanceof Date;
    }
}
exports.CartesianChartProxy = CartesianChartProxy;
//# sourceMappingURL=cartesianChartProxy.js.map