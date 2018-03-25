import React, { Component } from 'react';
import Hidden from 'material-ui/Hidden'
import MenuList from '../MenuList'
import MenuListSmall from '../MenuListSmall'
import { withStyles } from 'material-ui/styles'
import styles from './styles'

type Props = {
    classes: any,

    toggleComponent: () => void
}

class ResponsiveMenuList extends Component<Props> {
    render() {
        const { classes } = this.props
        return (
            <div className={classes.responsiveMenuListContainer}>
                <Hidden xsDown>
                    <MenuList toggleComponent={this.props.toggleComponent}/>
                </Hidden>
                <Hidden smUp>
                    <MenuListSmall toggleComponent={this.props.toggleComponent}/>
                </Hidden>
            </div>
        );
    }
}

export default withStyles(styles)(ResponsiveMenuList)