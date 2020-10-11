import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator} from 'draft-js';
import { Popup } from 'semantic-ui-react'
import backend from '../api/backend';

import 'draft-js/dist/Draft.css';
import './TextArea.css';

class TextArea extends Component {
    constructor(props) {
        super(props);

        this.state = { editorState: EditorState.createEmpty() };
        this.textArea = React.createRef();
    }

    findWithRegex = (regex, contentBlock, callback) => {
        const text = contentBlock.getText();
        let matchArr, start, end;
        while ((matchArr = regex.exec(text)) !== null) {
          start = matchArr.index;
          end = start + matchArr[0].length;
          callback(start, end);
        }
    };

    onChange = async editorState => {
        const text = editorState.getCurrentContent().getPlainText();
        if(text.endsWith('.') || text.endsWith('!') || text.endsWith('?')) {
            const response = await backend.post('/finalScore', {
                content: text
            });
            const data = response.data.sentences;
            const holisticResponse = await backend.post('/score', {
                content: text
            });
            var compositeData = [];
            for (let i = 0; i < data.length; i++) {
                let color = 'none';
                if (data[i].sentiment === 'positive') {
                    color = 'green';
                } else if (data[i].sentiment === 'negative') {
                    color = 'red';
                } else if (data[i].sentiment === 'mixed') {
                    color = 'yellow';
                }
                let regex = new RegExp(data[i].text, 'g');
                compositeData.push({
                    strategy: (contentBlock, callback) => {
                        this.findWithRegex(regex, contentBlock, callback);
                    },
                    component: (props) => {
                        return (
                            <Popup trigger={<span {...props} style={{ backgroundColor: color }}>{props.children}</span>}> 
                                <b>Key Positive Words: </b>{holisticResponse.data.good.join(', ')}<br />
                                <b>Key Negative Words: </b>{holisticResponse.data.bad.join(', ')}<br /><br />
                                <b>Confidence Scores:</b><br />
                                <b>Positive: </b>{data[i].scores.positive}<br />
                                <b>Neutral: </b>{data[i].scores.neutral}<br />
                                <b>Negative: </b>{data[i].scores.negative}
                            </Popup>
                        );
                    }
                });
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