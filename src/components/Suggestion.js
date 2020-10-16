/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Button, Modal, Popup } from 'semantic-ui-react'

class Suggestion extends Component {
    state = { positiveOpen: false, negativeOpen: false };

    render() { 
        return (
            <div className="ui text center aligned container">
                <Button.Group>
                    <Modal trigger={<Button negative>Make it negative!</Button>} onOpen={() => {this.setState({ negativeOpen: true })}} open={this.state.negativeOpen}>
                        <Modal.Header>Make it negative!</Modal.Header>
                        <Modal.Content>
                            <h4>These are some of the most positive sentences. In order to make 
                                these sentences negative you may want to change these sentences. 
                                You can click on a sentence to recieve feedback and additional 
                                information on how to make it negative.</h4>
                            {this.props.data.map((sentence, index) => {
                                if (sentence.posTopics.length > 0) {
                                    return (
                                        <Popup key={index} trigger={<p>{sentence.sentence.text}</p>}>
                                            <h4>Positive Topics:</h4>
                                            {sentence.posTopics.map((topic, index) => {
                                                return <p key={index}>{topic}</p>;
                                            })}
                                            <h4>Suggested Replacement Sentence:</h4>
                                            <p>{sentence.posSuggested}</p>
                                        </Popup>
                                    )
                                }
                            })}
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='red' onClick={() => {this.setState({ negativeOpen: false })}}>Close</Button>
                        </Modal.Actions>
                    </Modal>
                    <Button.Or />
                    <Modal trigger={<Button positive>Make it positive!</Button>} onOpen={() => {this.setState({ positiveOpen: true })}} open={this.state.positiveOpen}>
                        <Modal.Header>Make it positive!</Modal.Header>
                        <Modal.Content>
                            <h4>These are some of the most negative sentences. In order to make 
                                these sentences positive you may want to change these sentences. 
                                You can click on a sentence to recieve feedback and additional 
                                information on how to make it positive.</h4>
                            {this.props.data.map((sentence, index) => {
                                if (sentence.negTopics.length > 0) {
                                    return (
                                        <Popup key={index} trigger={<p>{sentence.sentence.text}</p>}>
                                            <h4>Negative Topics:</h4>
                                            {sentence.negTopics.map((topic, index) => {
                                                return <p key={index}>{topic}</p>;
                                            })}
                                            <h4>Suggested Replacement Sentence:</h4>
                                            <p>{sentence.negSuggested}</p>
                                        </Popup>
                                    )
                                }
                            })}

                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='red' onClick={() => {this.setState({ positiveOpen: false })}}>Close</Button>
                        </Modal.Actions>
                    </Modal>
                </Button.Group>
            </div>
        );
    }
}
 
export default Suggestion;