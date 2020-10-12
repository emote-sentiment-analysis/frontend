import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator} from 'draft-js';
import { Popup } from 'semantic-ui-react'
import backend from '../api/backend';

import './App.css';
import 'draft-js/dist/Draft.css';
import Meaning from './Meaning';
import Suggestion from './Suggestion';
import Hashtags from './Hashtags';

class App extends Component {
    state = { editorState: EditorState.createEmpty(), hashtags: [] };

    findWithRegex = (regex, contentBlock, callback) => {
        const text = contentBlock.getText();
        let matchArr, start, end;
        while ((matchArr = regex.exec(text)) !== null) {
          start = matchArr.index;
          end = start + matchArr[0].length;
          callback(start, end);
        }
    };

    onTextAreaChange = async editorState => {
        const text = editorState.getCurrentContent().getPlainText();
        if(text.endsWith('.') || text.endsWith('!') || text.endsWith('?')) {
            const response = await backend.post('/finalScore', {
                content: text
            });
            const data = response.data.sentences;
            var compositeData = [];
            for (let i = 0; i < data.length; i++) {
                let color = 'none';
                if (data[i].sentiment === 'positive') {
                    color = '#21ba45';
                } else if (data[i].sentiment === 'negative') {
                    color = '#db2828';
                } else if (data[i].sentiment === 'mixed') {
                    color = 'yellow';
                }
                let holisticResponse = await backend.post('/score', {
                    content: data[i].text
                });    
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
            const holisticResponse = await backend.post('/score', {
                content: text
            }); 
            let spanHighlight = new CompositeDecorator(compositeData);
            this.setState({editorState: EditorState.set(this.state.editorState, {decorator: spanHighlight}), hashtags: holisticResponse.data.top_tags});
        } else {
            this.setState({editorState});
        }
    }

    render() { 
        return ( 
            <div className="ui text container">
                <h1 className="ui center aligned icon huge header">
                    Sentiment Analysis
                </h1>

                <Editor className="text-area" editorState={this.state.editorState} onChange={this.onTextAreaChange} />
                <Hashtags hashtags={this.state.hashtags} />
                <Suggestion />
                <h2 className="color-header ui center aligned icon header">
                    What do the colors mean?
                </h2>
                <Meaning />
            </div>
        );
    }
}
 
export default App;