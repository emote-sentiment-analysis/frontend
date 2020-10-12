import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'

class Suggestion extends Component {
    state = {  }
    render() { 
        return (
            <div className="ui text center aligned container">
                    <Button.Group>
                        <Button negative>Make it negative!</Button>
                        <Button.Or />
                        <Button positive>Make it positive!</Button>
                    </Button.Group>
            </div>
        );
    }
}
 
export default Suggestion;