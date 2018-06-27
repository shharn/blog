import React, { Component } from 'react';

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
        console.dir(this.props);
        return (
            <div>
                Article List Page
            </div>
        );
    }
}

export default ArticleList;