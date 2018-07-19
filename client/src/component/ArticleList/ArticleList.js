import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

type Props = {
    classes: any,
    path: string,

    getArticlesOnMenu: (menuId: number) => void
}

class ArticleList extends Component<Props> {
    componentDidMount() {
        const { pathname } = this.props.location;
        const menuId = pathname.split('/')[2];
        this.props.getArticlesOnMenu(menuId);
    }

    render() {
        const { classes } = this.props;
        const mockContent = `This is Test article contents. This is Test article contents. This is Test article contents.
        This is Test article contents. This is Test article contents. This is Test article contents.
        This is Test article contents. This is Test article contents. This is Test article contents.`
        // const artices = this.props.data;
        return (
            <div className={classes.listContainer}>
                <Card className={classes.article}>
                    <CardHeader title="Test Title" subheader="July 14, 2018"/>
                    <CardMedia className={classes.articleImage} 
                        image="https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress\u0026cs=tinysrgb\u0026h=350"
                        title="Test Article Image"/>
                    <CardContent>
                        <Typography component="p">
                            {mockContent.substr(0, 150) + ' ... '}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleList);