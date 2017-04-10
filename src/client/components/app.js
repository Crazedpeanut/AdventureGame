import React from 'react'
import Game from './game';

class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Game></Game>
            </div>
        )
    }
}

export default App;