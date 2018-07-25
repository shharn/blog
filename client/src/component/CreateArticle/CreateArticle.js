import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class CreateArticle extends Component {
    constructor(props) {
        super(props);
        this.handleSelectMenuChange = this.handleSelectMenuChange.bind(this);
    }

    componentDidMount() {
        const { menus, isAuthenticated } = this.props;
        if (!isAuthenticated) {
            this.props.history.goBack();
        }

        if (!menus || menus.length < 1){
            alert('There should be at least one Menu.\nFirst, create a menu :)');
            this.props.history.goBack();
        }
    }

    handleSelectMenuChange() {

    }

    render() {
        const { classes, menus } = this.props;
        return (
            <Paper className={classes.container} elevation={4}>
                <FormControl fullWidth>
                    <div>Title</div>
                    <Input 
                        autoFocus
                        disableUnderline={true}
                        margin='normal'
                        placeholder='Enter the title !'
                        classes={{
                            input: classes.input
                        }}/>
                </FormControl>
                <FormControl fullWidth classes={{
                    root: classes.formContainer
                }}>
                    <div>Summary</div>
                    <Input
                        className={classes.summaryRoot}
                        disableUnderline={true}
                        multiline
                        rows={3}
                        placeholder='Enter the summary of it !'
                        classes={{
                            inputMultiline: classes.input
                        }}
                    />
                </FormControl>
                <FormControl fullWidth classes={{
                    root: classes.formContainer
                }}>
                    <div>Content</div>
                    <Input
                        disableUnderline={true}
                        multiline
                        rows={20}
                        placeholder='Fill the blank with your brilliant idea :)'
                        classes={{
                            inputMultiline: classes.input,
                        }}
                    />
                </FormControl>
                <FormControl fullWidth classes={{
                    root: classes.formContainer
                }}>
                    <div>Main Image URL</div>
                    <Input 
                        classes={{
                            input: classes.input
                        }}
                        margin='normal'
                        disableUnderline={true}
                        placeholder='Enter the image url !'/>
                </FormControl>
                <FormControl className={`${classes.formContainer} ${classes.selectContainer}`}>
                    <InputLabel 
                        shrink={false}
                        classes={{
                            formControl: classes.shrinkLabel
                        }} 
                        htmlFor='menuID'>Select Menu</InputLabel>
                    <Select
                        classes={{
                            root: classes.selectRoot
                        }}
                        autoWidth={true}
                        value={menus[0].uid}
                        onChange={this.handleSelectMenuChange}
                        inputProps={{
                            name: 'selectedMenuID',
                            id: 'menuID'
                        }}
                    >
                        {this.props.menus.map(menu => <MenuItem key={`select:${menu.uid}`} value={menu.uid}>{menu.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Paper>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreateArticle);