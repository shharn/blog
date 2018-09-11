// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { convertFromRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import cn from 'classnames';
import styles from './styles';
import './styles.css';

import type { 
    Element
} from 'react';
import type {
    WithStylesProps
} from '../../flowtype';

const getLastSplittedFromImageSrc = (src: string): string => {
    const splitted = src.split('/');
    const len = splitted.length;
    return splitted[len -1];
};

const blockToTag: {
    [string]: Element<*>
} = {
    'code-block': <pre/>
};

const blockToHTML = (block): Element<*> => blockToTag[block.type.toLowerCase()]

const entityToHTML = (entity, originalText: string): Element<*> | string => {
    switch(entity.type.toUpperCase()){
        case 'LINK':
            return <a href={entity.data.url}>{originalText}</a>;
        case 'IMAGE':
            const src = entity.data.src;
            return (
                    <img src={src} alt={getLastSplittedFromImageSrc(src)}/>
            );
        default:
            return originalText;
    }
};

type Props = {
    content: string
};

class ArticleDetailContent extends Component<Props & WithStylesProps> {
    render() {
        const { classes, content } = this.props;
        const parsed = JSON.parse(content);
        const contentState = convertFromRaw(parsed);
        const html = convertToHTML({
            blockToHTML,
            entityToHTML
        })(contentState);
        return (
            <div className={cn(classes.container, 'article_detail-content_container')} dangerouslySetInnerHTML={{ __html: html}}/>
        );
    }
}
export default withStyles(styles, { withTheme: true })(ArticleDetailContent);