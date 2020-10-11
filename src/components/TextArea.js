import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator} from 'draft-js';
import backend from '../api/backend';

import {PositiveSpan, NegativeSpan, MixedSpan, NeutralSpan} from './Spans'

import 'draft-js/dist/Draft.css';
import './TextArea.css';

class TextArea extends Component {
    constructor(props) {
        super(props);

        this.state = { content: '', formattedContent: '', editorState: EditorState.createEmpty() };
        this.textArea = React.createRef();
    }

    onChange = async editorState => {
        const text = editorState.getCurrentContent().getPlainText();
        if(text.endsWith('.') || text.endsWith('!') || text.endsWith('?')) {
            const response = await backend.post('/finalScore', {
                content: text
            })
            const data = response.data.sentences;
            var compositeData = [];
            var span;
            for (let i = 0; i < data.length; i++) {
                if (data[i].sentiment === 'positive') {
                    span = PositiveSpan;
                } else if (data[i].sentiment === 'negative') {
                    span =  NegativeSpan;
                } else if (data[i].sentiment === 'mixed') {
                    span = MixedSpan;
                } else if (data[i].sentiment === 'neutral') {
                    span = NeutralSpan;
                }
                compositeData.push({
                    strategy: (contentBlock, callback) => {
                        if (contentBlock.getText().search(data[i].text) !== -1) {
                            callback(contentBlock.getText().search(data[i].text), contentBlock.getText().search(data[i].text) + data[i].text.length);
                        }                
                    },
                    component: span
                    },    
                );
            }
            let spanHighlight = new CompositeDecorator(compositeData);
            this.setState({editorState: EditorState.set(this.state.editorState, {decorator: spanHighlight})});
        } else {
            this.setState({editorState});
        }
    }

    render() { 
        return (
            <Editor editorState={this.state.editorState} onChange={this.onChange} />
        );
    }
}
 
export default TextArea;