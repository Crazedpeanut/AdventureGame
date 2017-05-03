import React from 'react';

class CreateObjectFormComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    createGameObject() {
        const x = document.getElementById('x').value;
        const y = document.getElementById('y').value;
        const width = document.getElementById('width').value;
        const height = document.getElementById('height').value;
        const color = document.getElementById('color').value;

        this.props.onSubmit({
            x,
            y,
            width,
            height,
            color
        });
    }

    render() {
        return (
            <form>
                <input type="number" name="x" id="x" placeholder="x pos"/>
                <input type="number" name="y" id="y" placeholder="y pos"/>
                <input type="number" name="width" id="width" placeholder="width"/>
                <input type="number" name="height" id="height" placeholder="height"/>
                <input type="text" name="color" id="color" placeholder="color"/>
                <input type="button" name="button" value="create" onClick={this.createGameObject.bind(this)}/>
            </form>
        )
    }
}

module.exports = CreateObjectFormComponent;