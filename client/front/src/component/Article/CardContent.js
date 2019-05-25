// @flow
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

import type {
    WithStylesProps
} from '../../flowtype';

type Props = {
    containerClass: string,
    title: string,
    summary: string
};

class CardContent extends React.Component<Props & WithStylesProps> {
    render = () => {
        const { classes, containerClass, title, summary } = this.props;
        return (
            <div className={cn(containerClass, classes.root)}>
                <Typography variant="h5" className={classes.title}>{title}</Typography>
                <Typography variant="body2" className={classes.summary}>{summary}</Typography>
            </div>
        );
    }
}

export default withStyles(styles.content)(CardContent);