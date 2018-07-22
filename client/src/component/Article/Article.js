import React, { Component } from 'react';
import Card  from '@material-ui/core/Card';
import CardMedia from  '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import { nameTo}
import styles from './styles';

class Article extends Component {
    render() {
        const { article, classes, customClasses } = this.props;
        return (
            <a className={classes.outerAnchor} href={`/menus/${article.menu[0].name.toLowerCase().replace(' ', '-')}/articles/${article.title.toLowerCase().replace(' ', '-')}`}>
                <Card className={customClasses.root}>
                    <CardHeader title={article.title} subheader={article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' }) : 'May be, 2018'}/>
                    <CardMedia className={customClasses.cardMedia} 
                        image={article.imageSource}
                        title={article.title}/>
                    <CardContent>
                        <Typography component="p">
                            {article.content.length > 200 ? article.content.substr(0, 200) + ' ... ' : article.content}
                        </Typography>
                    </CardContent>
                </Card>
            </a>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Article);