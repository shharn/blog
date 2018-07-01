import React, { Component } from 'react';
import Card, { CardMedia, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

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