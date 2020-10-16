import React, { Component } from 'react';
import {Editor, EditorState, CompositeDecorator} from 'draft-js';
import { Popup } from 'semantic-ui-react'
import axios from 'axios';
import backend from '../api/backend';

import './App.css';
import 'draft-js/dist/Draft.css';
import Meaning from './Meaning';
import Suggestion from './Suggestion';
import Hashtags from './Hashtags';

class App extends Component {
    state = { editorState: EditorState.createEmpty(), hashtags: [], topicData: [] };

    findWithRegex = (regex, contentBlock, callback) => {
        const text = contentBlock.getText();
        let matchArr, start, end;
        while ((matchArr = regex.exec(text)) !== null) {
          start = matchArr.index;
          end = start + matchArr[0].length;
          callback(start, end);
        }
    };

    sortPositiveSentences(a, b) {
        if (a.scores.positive > b.scores.positive) {
            return -1;
        } 
        if (a.scores.positive < b.scores.positive) {
            return 1;
        }
        else {
            return 0;
        }
    }

    sortNegativeSentences(a, b) {
        if (a.scores.negative > b.scores.negative) {
            return -1;
        } 
        if (a.scores.negative < b.scores.negative) {
            return 1;
        }
        else {
            return 0;
        }
    }

    onTextAreaChange = async editorState => {
        this.setState({editorState})
        const text = editorState.getCurrentContent().getPlainText();
        if(text.endsWith('.') || text.endsWith('!') || text.endsWith('?')) {
            const response = await backend.post('/finalScore', {
                content: text
            });
            const data = response.data.sentences;
            var compositeData = [];
            var topicData = [];
            for (let i = 0; i < data.length; i++) {
                let color = 'none';
                let positive = [];
                let negative = [];
                let posTopics = [];
                let negTopics = [];
                for (let x = 0; x < data[i].aspects.length; x++) {
                    if (data[i].aspects[x].sentiment === 'positive') {
                        positive.push(data[i].aspects[x].text);
                        let opinion = parseInt(data[i].aspects[x].relations[0].ref.split('/').slice(-1)[0]);
                        posTopics.push(data[i].aspects[x].text + ' - ' + data[i].opinions[opinion].text)
                    } else if (data[i].aspects[x].sentiment === 'negative') {
                        negative.push(data[i].aspects[x].text);
                        let opinion = parseInt(data[i].aspects[x].relations[0].ref.split('/').slice(-1)[0]);
                        negTopics.push(data[i].aspects[x].text + ' - ' + data[i].opinions[opinion].text)
                    }
                }

                var posSuggested = data[i].text;
                var negSuggested = data[i].text;
                for (let i = 0; posTopics.length > i; i++) {
                    const response = await axios.get('https://api.datamuse.com/words?rel_ant=' + posTopics[i].split(' - ')[1])
                    if (response.data.length > 0) {
                        posSuggested = posSuggested.replace(posTopics[i].split(' - ')[1], response.data[0].word);
                    }
                }
                for (let i = 0; negTopics.length > i; i++) {
                    const response = await axios.get('https://api.datamuse.com/words?rel_ant=' + negTopics[i].split(' - ')[1])
                    if (response.data.length > 0) {
                        negSuggested = negSuggested.replace(negTopics[i].split(' - ')[1], response.data[0].word);
                    }
                }

                topicData.push({ sentence: data[i], posTopics, negTopics, posSuggested: posSuggested, negSuggested })

                if (data[i].sentiment === 'positive') {
                    color = '#21ba45';
                } else if (data[i].sentiment === 'negative') {
                    color = '#db2828';
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
                                {(positive.length > 0 || negative.length > 0) &&(
                                    <div className='topics'>
                                        {positive.length > 0 && (
                                            <React.Fragment>
                                                <p><b>Positive Topics: </b>{positive.join(', ')}</p>
                                            </React.Fragment>
                                        )}
                                        {negative.length > 0 && (
                                            <React.Fragment>
                                                <p><b>Negative Topics: </b>{negative.join(', ')}</p>
                                            </React.Fragment>
                                        )}
                                    </div>
                                )}
                                <b>Confidence Scores:</b><br />
                                {data[i].scores.positive != 0 && (
                                    <p><b>Positive: </b>{data[i].scores.positive}</p>
                                )}
                                {data[i].scores.neutral != 0 && (
                                    <p><b>Neutral: </b>{data[i].scores.neutral}</p>
                                )}
                                {data[i].scores.negative != 0 && (
                                    <p><b>Negative: </b>{data[i].scores.negative}</p>
                                )}
                            </Popup>
                        );
                    }
                });
            }

            const holisticResponse = await backend.post('/score', {
                content: text
            });
            let spanHighlight = new CompositeDecorator(compositeData);
            this.setState({editorState: EditorState.set(this.state.editorState, {decorator: spanHighlight}), hashtags: holisticResponse.data.top_tags, topicData });
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
                <Suggestion data={this.state.topicData} />
                <h2 className="color-header ui center aligned icon header">
                    What do the colors mean?
                </h2>
                <Meaning />
            </div>
        );
    }
}
 
export default App;