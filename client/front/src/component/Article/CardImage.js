// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

import type {
    WithStylesProps
} from '../../flowtype';

type Props = {
    containerClass: string,
    imageSource: string,
    alt: string
};

class CardImage extends React.Component<Props & WithStylesProps> {
    render = () => {
        const { containerClass, imageSource, alt, classes } = this.props;
        return (
            <div className={containerClass}>
                <img className={classes.innerImage} src={imageSource} alt={alt}></img>
            </div>
        )
    }
}

export default withStyles(styles.image)(CardImage);