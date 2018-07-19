import React, { Component } from 'react';
import Article from '../Article';
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
        const testArticles = [
            {
                uid: '0x9000',
                title: 'Test Title',
                createdAt: 'July 14, 2018',
                summary: 'Test Article\'s summary',
                content: `This is Test article contents. This is Test article contents. This is Test article contents.
                    This is Test article contents. This is Test article contents. This is Test article contents.
                    This is Test article contents. This is Test article contents. This is Test article contents.`,
                imageSource: "https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress\u0026cs=tinysrgb\u0026h=350",
                menu: [
                    {
                        name: 'test1',
                        uid: '0x1111'
                    }
                ]
            },{
                uid: '0x9001',
                title: 'Test Title',
                createdAt: 'July 14, 2018',
                summary: 'Test Article\'s summary',
                content: `This is Test article contents. This is Test article contents. This is Test article contents.
                    This is Test article contents. This is Test article contents. This is Test article contents.
                    This is Test article contents. This is Test article contents. This is Test article contents.`,
                imageSource: "https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress\u0026cs=tinysrgb\u0026h=350",
                menu: [
                    {
                        name: 'test1',
                        uid: '0x1111'
                    }
                ]
            },{
                uid:' 0x9002',
                title: 'Test Title',
                createdAt: 'July 14, 2018',
                summary: 'Test Article\'s summary',
                content: `This is Test article contents. This is Test article contents. This is Test article contents.
                    This is Test article contents. This is Test article contents. This is Test article contents.
                    This is Test article contents. This is Test article contents. This is Test article contents.`,
                imageSource: "https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress\u0026cs=tinysrgb\u0026h=350",
                menu: [
                    {
                        name: 'test1',
                        uid: '0x1111'
                    }
                ]
            }
        ]
        console.dir(this.props.classes);
        return (
            <div className={classes.listContainer}>
                {testArticles.map(article => <Article key={`article:${article.uid}`} article={article} customClasses={{ root: classes.article, cardMedia: classes.articleImage }}/>)}
                {/* <Card className={classes.article}>
                    <CardHeader title="Test Title" subheader="July 14, 2018"/>
                    <CardMedia className={classes.articleImage} 
                        image="https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress\u0026cs=tinysrgb\u0026h=350"
                        title="Test Article Image"/>
                    <CardContent>
                        <Typography component="p">
                            {mockContent.substr(0, 150) + ' ... '}
                        </Typography>
                    </CardContent>
                </Card> */}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleList);