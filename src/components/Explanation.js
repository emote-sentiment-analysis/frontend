/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Transition } from 'semantic-ui-react';

class Explanation extends Component {
    constructor(props) {
        super(props);

        this.state = { card: '' }
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            card: nextProps.card,
        };
    }       

    render() { 
        return (
            <Transition.Group animation="fade down" duration="500">
                {this.state.card === 'positive' && (
                    <div className="ui message">
                        <div className="header">
                            Positive
                        </div>
                        <div className="ui  placeholder">
                            <p> Positive words are bright and optimistic. Positivity is determined by an Azure Machine Learning Algorithm and the SenticNet 5 database. </p>
                        </div>
                    </div>
                )}
                {this.state.card === 'mixed' && (
                    <div className="ui message">
                        <div className="header">
                            Mixed
                        </div>
                        <div className="ui  placeholder">
                            <div className="line"></div>
                            <div className="line"></div>
                        </div>
                    </div>
                )}
                {this.state.card === 'negative' && (
                    <div className="ui message">
                        <div className="header">
                            Negative
                        </div>
                        <div className="ui  placeholder">
                            <div className="line"></div>
                            <div className="line"></div>
                        </div>
                    </div>
                )}
                {this.state.card === 'neutral' && (
                    <div className="ui message">
                        <div className="header">
                            Neutral
                        </div>
                        <div className="ui  placeholder">
                            <div className="line"></div>
                            <div className="line"></div>
                        </div>
                    </div>
                )}
            </Transition.Group>
        );
    }
}
 
export default Explanation;
