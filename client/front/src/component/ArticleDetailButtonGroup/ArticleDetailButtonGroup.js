// @flow
import * as React from 'react';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import styles from './styles';
import type { WithStylesProps} from '../../flowtype';

type Props = {
    isAuthenticated: boolean,
    admin: boolean,
    parentURL: string
};

class ArticleDetailButtonGroup extends React.Component<Props & WithStylesProps> {
    render = () => {
        const { classes, isAuthenticated, admin, parentURL } = this.props;
        return (
            <div className={classes.container}>
                <Button 
                    component={Link} 
                    to={parentURL} 
                    className={cn(classes.button, classes.listButton)}
                >
                    <ListIcon fontSize='inherit'/>
                </Button>
                {(isAuthenticated && admin) &&
                    <React.Fragment>
                        <Button 
                            classes={{ root: cn(classes.button, classes.iconButton)}}
                            onClick={this.props.onDeleteButtonClicked}
                            aria-label="delete article"
                        >
                            <DeleteIcon/>
                        </Button>
                        <Button 
                            classes={{ root: cn(classes.button, classes.iconButton)}}
                            onClick={this.props.onEditButtonClicked}
                            aria-label="edit article"
                        >
                            <EditIcon fontSize='inherit'/>
                        </Button>
                        <Button 
                            classes={{ root: cn(classes.button, classes.iconButton, classes.flexEnd)}}
                            component={Link} 
                            to={`/admin/article?prev=${encodeURI(document.location.pathname)}`} 
                            aria-label="create article"
                        >
                            <AddIcon/>
                        </Button>
                    </React.Fragment>}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleDetailButtonGroup);