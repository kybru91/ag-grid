#!/bin/sh

set -eu

find ./packages/**/src -name \*.ts | xargs sed -e "s/'ag-charts-types\/scene'/'ag-charts-community\/scene'/" -i ''

git apply <<EOF
diff --git a/packages/ag-grid-enterprise/src/charts/agChartsExports.ts b/packages/ag-grid-enterprise/src/charts/agChartsExports.ts
index 2758dab026..90eb0075ae 100644
--- a/packages/ag-grid-enterprise/src/charts/agChartsExports.ts
+++ b/packages/ag-grid-enterprise/src/charts/agChartsExports.ts
@@ -1,8 +1,9 @@
-import type { IntegratedModule } from 'ag-charts-types';
+import type { AgChartsCommunityModule } from 'ag-charts-community';
 
 import type { NamedBean } from 'ag-grid-community';
 import { BeanStub } from 'ag-grid-community';
-type ChartTypes = IntegratedModule;
+
+type ChartTypes = typeof AgChartsCommunityModule;
 
 /** Bean to expose the AG Charts apis from a single location and not require a code dependency on ag-charts-community */
 export class AgChartsExports extends BeanStub implements NamedBean {
EOF
