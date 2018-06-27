import React, { Component } from 'react';
 import type { FetchStatus } from '../../constant';

type Props = {
    classes: any,
    path: string,
    
    articles: Array<Article>,
    error: any,
    fetchStatus: $Values<FetchStatus>,
    fetchComplete: boolean,
}

class HottestArticleList extends Component<Props> {
    render() {
        return (
            <div>
                Hottest Article Page
            </div>
        );
    }
}

export default HottestArticleList;