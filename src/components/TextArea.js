/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {Editor} from 'draft-js';

class TextArea extends Component {
    render() {
        return (
            <div className="ui form">
                <div className="field">
                    <Editor editorState={this.props.editorState} onChange={this.props.onChange} />
                </div>
            </div>
        );
    }
}

export default TextArea;