/* eslint-disable react/prop-types */
import React, { Component } from 'react';

class Hashtags extends Component {
    render() { 
        const hashtags = this.props.hashtags.map((hashtag, index) => {
            return <a key={index}>{hashtag} </a>;
        })
        return (
            <div className="ui text center aligned container">
                {hashtags}
            </div>
        );
    }
}
 
export default Hashtags;