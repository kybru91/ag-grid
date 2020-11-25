import React from 'react';
import { Helmet } from 'react-helmet';
import { getPageName } from '../utils/get-page-name';
import toKebabCase from '../utils/to-kebab-case';
import ExampleRunner from '../components/example-runner/ExampleRunner';
import pageStyles from './doc-page.module.scss';
import styles from './chart-gallery-page.module.scss';

const ChartGalleryPageTemplate = ({ pageContext: { framework, name, description, previous, next }, location }) => {
    const pageName = getPageName(location.pathname);
    const title = `AG-Charts Gallery: ${name}`;

    return (
        <div id="doc-page-wrapper" className={pageStyles.docPageWrapper}>
            <div id="doc-content" className={pageStyles.docPage}>
                <Helmet title={title} />

                <div className={styles.chartNavigation}>
                    {/* eslint-disable jsx-a11y/control-has-associated-label */}
                    {previous && <a className={styles.chartNavigation__left} href={`../${toKebabCase(previous)}/`} dangerouslySetInnerHTML={{ __html: `\u276e&nbsp;&nbsp;${previous}` }}></a>}
                    {next && <a className={styles.chartNavigation__right} href={`../${toKebabCase(next)}/`} dangerouslySetInnerHTML={{ __html: `${next}&nbsp;&nbsp;\u276f` }}></a>}
                    {/* eslint-enable jsx-a11y/control-has-associated-label */}
                </div>

                <h1 className={styles.title}>{title}</h1>
                <p dangerouslySetInnerHTML={{ __html: description }}></p>

                <ExampleRunner
                    title={name}
                    name={pageName}
                    type="generated"
                    framework={framework}
                    pageName={'charts-overview'}
                    library="charts"
                    options={{ exampleHeight: '60vh' }} />
            </div>
        </div>
    );
};

export default ChartGalleryPageTemplate;
