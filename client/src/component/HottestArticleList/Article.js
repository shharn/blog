import React, { Component } from 'react';
import Card  from '@material-ui/core/Card';
import CardMedia from  '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class Article extends Component {
    render() {
        const { article, classes } = this.props;
        return (
            <Card className={classes.root}>
                <CardMedia className={classes.media} image={article.imageSource} title={article.title}/>
                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        {article.title}
                    </Typography>
                    <Typography component="p">
                        {article.summary}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default Article;