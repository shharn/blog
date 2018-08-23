import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import Editor from '../CreateArticleEditor';
import { formatString } from '../../util';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

const errorMessageFormat = 'Should input the %s';
const listToValidate = [ 'title', 'summary', 'content' ];

class CreateArticle extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
        this.handleCancelButtonClick = this.handleCancelButtonClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.checkForms = this.checkForms.bind(this);
        this.getPrevURLFromQueryString = this.getPrevURLFromQueryString.bind(this);
        this.getRawDataFromEditor = this.getRawDataFromEditor.bind(this);
        this.state = {
            data: {
                title: '',
                summary: '',
                imageSource: '',
                menuID: (this.props.menus && this.props.menus.length > 0) ? this.props.menus[0].uid : ''
            },
            error: {
                title: null,
                summary: null,
                content: null,
            }
        };
    }

    componentDidMount() {
        const { menus, isAuthenticated, isEditMode } = this.props;
        if (!isAuthenticated) {
            this.props.history.goBack();
        }

        if (!menus || menus.length < 1){
            alert('There should be at least one Menu.\nFirst, create a menu :)');
            this.props.history.goBack();
        }

        if (isEditMode) {
            this.setState({
                data: { ...this.prop.article }
            });
        }
    }

    handleInputChange(e) {
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            }
        });
    }

    handleSubmitButtonClick() {
        const { data } = this.state;
        const content = this.editorRef.getContentWithHTML();
        const dataToSend = {
            title: data.title,
            summary: data.summary,
            content,
            imageSource: data.imageSource,
            menu: [{
                uid: data.menuID
            }]
        };
        if (!this.checkForms(dataToSend)) {
            return;
        }

        const { isEditMode, submitNewArticle, submitUpdatedArticle } = this.props
        console.dir(dataToSend);
        isEditMode ? submitUpdatedArticle(dataToSend) : submitNewArticle(dataToSend);
        this.props.history.push(this.getPrevURLFromQueryString());
    }

    getRawDataFromEditor() {
        return this.editorRef.getRawData();
    }

    handleCancelButtonClick() {
        this.props.history.push(this.getPrevURLFromQueryString());
    }

    checkForms(data) {
        let pass = true;
        let tmpError = {};
        listToValidate.forEach(val => {
            if (data[val].length < 1) {
                pass = false;
                tmpError[val] = formatString(errorMessageFormat, val);
            } 
        });
        this.setState({ error: tmpError });
        return pass;
    }

    getPrevURLFromQueryString() {
        let prevURL = decodeURI(this.props.location.search.split('=')[1]);
        return prevURL;
    }

    render() {
        const { classes, menus } = this.props;
        const { title, summary, imageSource, menuID } = this.state.data;
        const { error } = this.state;
        return (
            <Paper className={classes.container} elevation={4}>
                <FormControl fullWidth error={(error.title && error.title.length > 0)}>
                    <div>Title</div>
                    <Input 
                        value={title}
                        autoFocus
                        disableUnderline={true}
                        onChange={this.handleInputChange}
                        placeholder='Enter the title !'
                        classes={{
                            input: classes.input
                        }}
                        inputProps={{
                            name: 'title'
                        }}/>
                    <FormHelperText>{(error.title && error.title.length > 0) && error.title}</FormHelperText>
                </FormControl>
                <FormControl fullWidth 
                    classes={{
                        root: classes.formContainer
                    }}
                    error={(error.summary && error.summary.length > 0)}
                >
                    <div>Summary</div>
                    <Input
                        className={classes.summaryRoot}
                        value={summary}
                        disableUnderline={true}
                        multiline
                        rows={3}
                        placeholder='Enter the summary of it !'
                        onChange={this.handleInputChange}
                        classes={{
                            root: classes.multilineRoot,
                            inputMultiline: classes.input
                        }}
                        inputProps={{
                            name: 'summary'
                        }}
                    />
                    <FormHelperText>{(error.summary && error.summary.length > 0) && error.summary}</FormHelperText>
                </FormControl>
                <Editor ref={ref => this.editorRef = ref}/>
                <FormControl 
                    fullWidth
                    classes={{
                        root: classes.formContainer
                    }}
                >
                    <div>Main Image URL</div>
                    <Input 
                        classes={{
                            input: classes.input
                        }}
                        inputProps={{
                            name: 'imageSource'
                        }}
                        value={imageSource}
                        onChange={this.handleInputChange}
                        disableUnderline={true}
                        placeholder='Enter the image url !'/>
                </FormControl>
                <FormControl className={classes.selectContainer}>
                    <InputLabel 
                        shrink={false}
                        classes={{
                            formControl: classes.shrinkLabel
                        }} 
                        htmlFor='menuID'>Select Menu</InputLabel>
                    <Select
                        classes={{
                            root: classes.selectRoot,
                        }}
                        autoWidth={true}
                        value={menuID.length > 0 ? menuID : menus[0].uid}
                        onChange={this.handleInputChange}
                        inputProps={{
                            name: 'menuID',
                            id: 'menuID'
                        }}
                    >
                        {this.props.menus.map(menu => <MenuItem key={`select:${menu.uid}`} value={menu.uid}>{menu.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <div className={classes.footer}>
                    {/* {this.getExtraComponent(isFetching, status)} */}
                    <div className={classes.buttonContainer}>
                        <Button className={classes.button} aria-label="confirm" color="default" onClick={this.handleSubmitButtonClick}>
                            <SaveIcon/>
                        </Button>
                        <Button className={classes.button} aria-label="cancel" onClick={this.handleCancelButtonClick} color="default">
                            <ClearIcon/>
                        </Button>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreateArticle);