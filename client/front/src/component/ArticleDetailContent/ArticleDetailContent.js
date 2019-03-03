// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { convertFromRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import cn from 'classnames';
import styles from './styles';
import './styles.css';
import type { Element } from 'react';
import type { WithStylesProps } from '../../flowtype';

const getLastSplittedFromImageSrc = (src: string): string => {
    const splitted = src.split('/');
    const len = splitted.length;
    return splitted[len -1];
};

const blockToHTML = (block): Element<*> | { element: Element<*>, nest: Element<*> } => {
    switch(block.type.toLowerCase()) {
        case 'header-one':
            return <h1/>;
        case 'header-two':
            return <h2/>;
        case 'header-three':
            return <h3/>;
        case 'header-four':
            return <h4/>;
        case 'header-five':
            return <h5/>;
        case 'header-six':
            return <h6/>;
        case 'code-block': 
            return <pre/>;
        case 'unordered-list-item':
            return {
                element: <li/>,
                nest: <ul/>
            };
        case 'blockquote':
            return <blockquote/>;
        case 'ordered-list-item':
            return {
              element: <li/>,
              nest: <ol/>  
            };
        case 'unstyled':
            return block.text.length > 0 ? <p/> : <br/>;
        default:
            return <p/>;
    }
}

const entityToHTML = (entity, originalText: string): Element<*> | string => {
    switch(entity.type.toUpperCase()){
        case 'LINK':
            return <a href={entity.data.url} target="_blank">{originalText}</a>;
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
    render = () => {
        const { classes, content } = this.props;
        let html = '';
        if (content && content.length) {
            const parsed = JSON.parse(content);
            const contentState = convertFromRaw(parsed);
            html = convertToHTML({
                blockToHTML,
                entityToHTML
            })(contentState);
        }
        return (
            <div className={cn(classes.container, 'article_detail-content_container')} dangerouslySetInnerHTML={{ __html: html}}/>
        );
    }
}
export default withStyles(styles, { withTheme: true })(ArticleDetailContent);