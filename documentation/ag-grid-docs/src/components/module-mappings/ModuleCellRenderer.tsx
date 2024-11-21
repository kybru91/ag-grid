import { EnterpriseIcon } from '@ag-website-shared/components/icon/EnterpriseIcon';

import type { CustomCellRendererProps } from 'ag-grid-react';

import styles from './ModuleCellRenderer.module.scss';

export function ModuleCellRenderer({ value, data }: CustomCellRendererProps) {
    const { isEnterprise } = data;

    return isEnterprise ? (
        <span className={styles.container}>
            {value} <EnterpriseIcon />
        </span>
    ) : (
        value
    );
}
