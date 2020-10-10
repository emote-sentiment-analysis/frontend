import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'

import './TextArea.css';

const data = [ 
    {scores: {negative: 1.0, neutral: 0.0, positive: 0.0},
    sentiment: 'negative',
    text: 'I am torn on the new XBOX.'},

    {scores: {negative: 0.0, neutral: 0.0, positive: 1.0},
    sentiment: 'negative',
    text: 'It has clean, pretty lines, but it will not connect to the internet, making it useless.'}
]

class TextArea extends Component {
    constructor(props) {
        super(props);

        this.state = { content: '', formattedContent: '' };
        this.textArea = React.createRef();
    }

    componentDidMount() {
        this.textArea.current.focus();
    }

    contentEditableChange = event => {
        if(event.target.value.endsWith('.')) {
            // call API
            console.log('Called')
            var formatted = '<p>';
            for (let i = 0; i < data.length; i++) {
                formatted = formatted + '<span style="background-color:rgb(' + data[i].scores.negative * 255 + ',' + data[i].scores.positive * 255 + ',' + data[i].scores.neutral * 255 + ')" contenteditable="false">' + event.target.value.split('. ')[i] + '</span>';
            }
            formatted = formatted + '</p>';
            this.setState({ content: formatted, formattedContent: formatted });
        } else {
            this.setState({ content: event.target.value});
        }
        console.log(this.state)
    }

    render() { 
        return (
            <ContentEditable className="text-area"
                innerRef={this.textArea}
                html={this.state.content}
                disabled={false}
                onChange={this.contentEditableChange}
            />
        );
    }
}
 
export default TextArea;