import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'

import Explanation from './Explanation';

class Meaning extends Component {
    state = { card: false };

    onButtonClick = e => {
        if (this.state.card === e.target.innerHTML.toLowerCase()) {
            this.setState({ card: '' })
        } else {
            this.setState({ card: e.target.innerHTML.toLowerCase() });
        }
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="ui text center aligned container">
                    <Button basic color="green" content="Positive" onClick={this.onButtonClick} />
                    <Button basic color="yellow" content="Mixed" onClick={this.onButtonClick} />
                    <Button basic color="red" content="Negative" onClick={this.onButtonClick} />
                    <Button basic content="Neutral" onClick={this.onButtonClick} />
                </div>
                <Explanation card={this.state.card} />
            </ React.Fragment>
        );
    }
}
 
export default Meaning;