---
title: "SSRM Pivoting"
enterprise: true
---

In this section we add Server-Side Pivoting to create an example with the ability to 'Slice and Dice'
data using the Server-Side Row Model (SSRM).

## Enabling Pivoting

To pivot on a column `pivot=true` should be set on the column definition. Additionally the grid needs to be in
pivot mode which is set through the grid option `pivotMode=true`.

In the snippet below a pivot is defined on the 'year' column and pivot mode is enabled:

<snippet>
const gridOptions = {
    // pivot mode enabled
    pivotMode: true,
    columnDefs: [
        { field: 'country', rowGroup: true },
        // pivot enabled
        { field: 'year', pivot: true },
        { field: 'total' },
    ],
}
</snippet>

For more configuration details see the section on [Pivoting](/pivoting/).


## Pivoting on the Server

The actual pivoting is performed on the server when using the Server-Side Row Model.
When the grid needs more rows it makes a request via `getRows(params)` on the
[Server-Side Datasource](/server-side-model-datasource/#datasource-interface) with metadata
containing row grouping details.

The properties relevant to pivoting in the request are shown below:

```ts
// IServerSideGetRowsRequest
{
   // pivot columns, cols with 'pivot=true'
   pivotCols: ColumnVO[];

    // true if pivot mode is one, otherwise false
   pivotMode: boolean;

   ... // other properties
}
```

Note in the snippet above that `pivotCols` contains all the columns the grid is pivoting on,
and `pivotMode` is used to determine if pivoting is currently enabled in the grid.

## Setting Pivot Result Columns

Pivot Result Columns are the columns that are created as part of the pivot function. You must provide
these to the grid in order for the grid to display the correct columns for the active pivot function.

For example, if you pivot on `Year`, you need to add columns to the grid for each year contained in the
data, e.g. `2000`, `2002`, `2004` e.t.c.

### Providing Pivot Result Fields (Simple)

The simplest way to provide pivot result columns is by returning the fields containing your pivoted data via the `pivotResultFields` attribute in the `getRows` success callback. These fields are used to generate pivot result columns and appropriate column groups, by splitting the string by `serverSidePivotResultSeparator` (which defaults to `_`).

The following example has the following basic configuration:

<snippet>
const gridOptions = {
    columnDefs: [
        { field: 'country', rowGroup: true },
        { field: 'year', pivot: true },
        { field: 'total', aggFunc: 'sum' },
    ],
    rowModelType: 'serverSide',
    pivotMode: true,
}
</snippet>

The example below demonstrates this in action, note the following:
- The `pivotResultFields` attribute is returned from the server, and then passed to the grid via the `getRows` success callback. These are logged to the console as a demonstration.
- The grid splits the `pivotResultFields` by `_` and creates the pivot result columns and column groups. The generated columns use the provided fields to access the data from the rows.
- Because the final section of the `pivotResultField` string is `total`, the grid links the secondary column to the primary column with the id `total`. This allows the grid to populate the aggregation function, e.g. `sum` for the secondary column.

<grid-example title='Simple Managed Pivot' name='simple-managed-pivot' type='generated' options='{ "enterprise": true, "exampleHeight": 605, "extras": ["alasql"], "modules": ["serverside", "rowgrouping", "menu", "columnpanel"] }'></grid-example>

<note>
When using managed columns, you can use [Pivot Callbacks](../pivoting/#pivot-result-column-definitions) to customise the pivot result column definitions.
</note>

### Providing Pivot Result Columns (Advanced)

For more flexibility, you can provide the pivot result columns yourself via the API.

<api-documentation source='column-api/api.json' section='Pivoting' names='["setPivotResultColumns"]' ></api-documentation>

Pivot result columns are defined identically to the columns supplied to the grid options: you provide a list of [Column Definitions](/column-definitions/) passing a list of columns and / or column groups using the following column API method:

<snippet>
gridOptions.columnApi.setPivotResultColumns(pivotColDefs);
</snippet>

There is no limit or restriction as to the number of columns or groups you pass. However, it's important that the field (or value getter) that you set for the columns match.

The following example has the following basic configuration:

<snippet>
const gridOptions = {
    columnDefs: [
        { field: 'country', rowGroup: true },
        { field: 'year', pivot: true },
        { field: 'total', aggFunc: 'sum' },
    ],
    rowModelType: 'serverSide',
    pivotMode: true,
}
</snippet>

The example below demonstrates providing pivot result columns via API. Note that new column definitions created from the `pivotFields` are returned from the server and supplied to the grid using `columnApi.setPivotResultColumns(pivotColDefs)`.

<note>
The pivot result columns are displayed in the order they are supplied to `columnApi.setPivotResultColumns(pivotColDefs)`. You can control the order of the columns by sorting the `pivotColDefs` array before passing it to the grid.
</note>

<grid-example title='Simple Pivot' name='simple-pivot' type='generated' options='{ "enterprise": true, "exampleHeight": 605, "extras": ["alasql"], "modules": ["serverside", "rowgrouping", "menu", "columnpanel"] }'></grid-example>

## Example: Pivot Column Groups

The example below demonstrates server-side Pivoting with multiple row groups where there are multiple value columns ('gold', 'silver', 'bronze') under the 'year' pivot column group. Note the following:

- Pivot mode is enabled through the grid option `pivotMode=true`.
- A pivot is placed on the **Year** column via `pivot=true` defined on the column definition.
- Rows are grouped by **Country** and **Sport** with `rowGroup=true` defined on their column definitions.
- The **Gold**, **Silver** and **Bronze** value columns have `aggFunc='sum'` defined on their column definitions.
- The `pivotCols` and `pivotMode` properties in the request are used by the server to perform pivoting.
- New column group definitions created from the `pivotFields` are returned from the server and supplied to the grid using `columnApi.setPivotResultColumns(pivotColDefs)`.
- Open the browser's dev console to view the request supplied to the datasource.

<grid-example title='Pivot Column Groups' name='pivot-column-groups' type='generated' options='{ "enterprise": true, "exampleHeight": 610, "extras": ["alasql"], "modules": ["serverside", "rowgrouping", "menu", "columnpanel"] }'></grid-example>

## Example: Slice and Dice

A mock data store running inside the browser is used in the example below. The purpose of the mock server is to demonstrate the interaction between the grid and the server. For your application, your server will need to understand the requests from the client and build SQL (or the SQL equivalent if using a no-SQL data store) to run the relevant query against the data store.

The example demonstrates the following:

- Columns `Athlete, Age, Country, Year` and `Sport` all have `enableRowGroup=true` which means they can be grouped on. To group, you drag the columns to the row group panel section. By default the example is grouping by `Country` and then `Year` as these columns have `rowGroup=true`.

- Columns `Gold, Silver` and `Bronze` all have `enableValue=true` which means they can be aggregated on. To aggregate, you drag the column to the `Values` section. When you are grouping, all columns in the `Values` section will be aggregated.

- You can turn the grid into **Pivot Mode**. To do this, you click the pivot mode checkbox. When the grid is in pivot mode, the grid behaves similar to an Excel grid. This extra information is passed to your server as part of the request and it is your server's responsibility to return the data in the correct structure.

- Columns **Age, Country, Year** and **Sport** all have `enablePivot=true` which means they can be pivoted on when **Pivot Mode** is active. To pivot, you drag the column to the **Pivot** section.

- Note that when you pivot, it is not possible to drill all the way down the leaf levels.

- In addition to grouping, aggregation and pivot, the example also demonstrates filtering. The columns **Country** and **Year** have grid-provided filters. The column **Age** has an example-provided custom filter. You can use whatever filter you want, as long as your server knows what to do with it.

<grid-example title='Slice And Dice' name='slice-and-dice' type='generated' options='{ "enterprise": true, "exampleHeight": 605, "modules": ["serverside", "rowgrouping", "menu", "columnpanel", "filterpanel", "setfilter"] }'></grid-example>

## Next Up

Continue to the next section to learn about [Pagination](/server-side-model-pagination/).

