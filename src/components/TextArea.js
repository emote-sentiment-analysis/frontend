import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'
import backend from '../api/backend';

import './TextArea.css';

class TextArea extends Component {
    constructor(props) {
        super(props);

        this.state = { content: '', formattedContent: '' };
        this.textArea = React.createRef();
    }

    componentDidMount() {
        this.textArea.current.focus();
    }

    contentEditableChange = async event => {
        const text = event.target.value.replace(/(<([^>]+)>)/gi, "").replace('&nbsp;', ' ');
        if(text.endsWith('.') || text.endsWith('!') || text.endsWith('?')) {
            const response = await backend.post('/finalScore', {
                content: text
            })
            const data = response.data.sentences;
            var formatted = '<p>';
            for (let i = 0; i < data.length; i++) {
                formatted = formatted + '<span style="background-color:rgb(' + data[i].scores.negative * 255 + ',' + data[i].scores.positive * 255 + ',' + data[i].scores.neutral * 255 + ')" contenteditable="false">' + data[i].text + ' </span> ';
            }
            formatted = formatted + '</p>';
            this.setState({ content: formatted, formattedContent: formatted });
        } else {
            this.setState({ content: event.target.value});
        }
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