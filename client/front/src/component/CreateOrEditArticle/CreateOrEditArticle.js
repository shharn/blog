// @flow
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
import { FetchStatus } from '../../constant';
import { Typography } from '@material-ui/core';

import type {
    WithStylesProps,
    RouterProps,
    Menu,
    Article
} from '../../flowtype';

const errorMessageFormat: string = 'Should input the %s';
const listToValidate: Array<string> = [ 'title', 'summary', 'content' ];

type ArticleToSend = {
    uid?: string,
    title: string,
    summary: string,
    content: string,
    imageSource: string,
    menu: Array<{
        uid: string
    }>
};

type FormErrors = {
    title: string,
    summary: string,
    content: string
};

type Props = {
    menus: Array<Menu>,
    isAuthenticated: boolean,
    fetchStatus: $Values<FetchStatus>,
    isEditMode: boolean,
    article: ?Article,

    submitNewArticle: (data: ArticleToSend) => void,
    submitUpdatedArticle: (data: Article) => void,
    initializeState: () => void
}

type State = {
    data: {
        uid: string,
        title: string,
        summary: string,
        imageSource: string,
        menuID: string
    },
    error: FormErrors
};

class CreateArticle extends Component<Props & WithStylesProps & RouterProps, State> {
    editorRef: any;
    state = {
        data: {
            uid: this.props.isEditMode ? this.props.article.uid : '',
            title: this.props.isEditMode ? this.props.article.title : '',
            summary: this.props.isEditMode ? this.props.article.summary : '',
            imageSource: this.props.isEditMode ? this.props.article.imageSource : '',
            menuID: this.props.isEditMode ? this.props.article.menu[0].uid : this.props.menus[0].uid
        },
        error: {
            title: '',
            summary: '',
            content: '',
        }
    };

    constructor(props) {
        super(props);
        const { isEditMode, menus } = this.props;
        if (!menus || menus.length < 1) {
            alert('There must be at least one menu. Create a menu first :)');
            this.props.history.push(this.getPrevURLFromQueryString());
        }

        if (isEditMode) {
            if (!this.props.article) {
                alert('Something is wrong.\nArticle should not be null on edit mode');
            }
        }
    }

    componentDidUpdate = () => {
        const { fetchStatus } = this.props;
        if (fetchStatus === FetchStatus.SUCCESS) {
            this.props.history.push(this.getPrevURLFromQueryString());
        }
    }

    componentWillUnmount = () => {
        this.props.initializeState();
    }

    handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            }
        });
    }

    handleSubmitButtonClick = (): void => {
        const { data } = this.state;
        const content = this.getJSONStringContent();
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
        isEditMode ? submitUpdatedArticle({ uid: data.uid, ... dataToSend }) : submitNewArticle(dataToSend);
    }

    getJSONStringContent = (): string => {
        const rawContent = this.editorRef.getContent();
        return JSON.stringify(rawContent);
    }

    handleCancelButtonClick = (): void => {
        this.props.history.push(this.getPrevURLFromQueryString());
    }

    checkForms = (data: ArticleToSend): boolean => {
        let pass = true;
        let tmpError: FormErrors = {
            title: '',
            summary: '',
            content: ''
        };
        listToValidate.forEach(val => {
            if (data[val].length < 1) {
                pass = false;
                tmpError[val] = formatString(errorMessageFormat, val);
            } 
        });
        this.setState({ error: tmpError });
        return pass;
    }

    getPrevURLFromQueryString = (): string => {
        let prevURL = decodeURI(this.props.location.search.split('=')[1]);
        return prevURL;
    }

    render = () => {
        const { classes, isEditMode, article, fetchStatus } = this.props;
        const { title, summary, imageSource, menuID } = this.state.data;
        const { error } = this.state;
        return (
            <Paper className={classes.container} elevation={4}>
                <FormControl fullWidth error={(!!error.title && (error.title.length > 0))}>
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
                    <FormHelperText>{(!!error.title && (error.title.length > 0)) && error.title}</FormHelperText>
                </FormControl>
                <FormControl fullWidth 
                    classes={{
                        root: classes.formContainer
                    }}
                    error={(!!error.summary && (error.summary.length > 0))}
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
                    <FormHelperText>{(!!error.summary && (error.summary.length > 0)) && error.summary}</FormHelperText>
                </FormControl>
                <Editor ref={ref => this.editorRef = ref} isEditMode={isEditMode} content={article ? article.content : ''}/>
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
                        value={menuID}
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
                    <div className={classes.buttonContainer}>
                        <Button className={classes.button} aria-label="confirm" color="default" onClick={this.handleSubmitButtonClick}>
                            <SaveIcon/>
                        </Button>
                        <Button className={classes.button} aria-label="cancel" onClick={this.handleCancelButtonClick} color="default">
                            <ClearIcon/>
                        </Button>
                    </div>
                </div>
                {fetchStatus === FetchStatus.FAIL &&
                    <Typography className={classes.errorMessage} variant="body1" style={{color: 'red'}}>{`Fail to ${isEditMode ? 'update' : 'create a new article'} :(`} </Typography>}
            </Paper>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreateArticle);