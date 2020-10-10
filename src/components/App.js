import React, { Component } from 'react';

import './App.css';
import TextArea from './TextArea';

class App extends Component {
    render() { 
        return ( 
            <div>
                <h1 className="ui center aligned icon header">
                    <i className="smile outline icon" />
                    Sentiment Analysis
                </h1>
                <TextArea />
            </div>
        );
    }
}
 
export default App;