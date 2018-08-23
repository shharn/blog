import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class ArticleDetailContent extends Component {
    render() {
        const { classes, content } = this.props;
        return (
            <div className={classes.container} dangerouslySetInnerHTML={{__html: content}} >
                {/* {content} */}
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(ArticleDetailContent);