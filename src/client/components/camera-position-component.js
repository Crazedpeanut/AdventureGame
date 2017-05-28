import React from 'react';

class CameraPositionComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>Camera Position</div>
                <form>
                    <label>X {this.props.cameraPositionX}</label><input value={this.props.cameraPositionY}/>
                    <label>Y</label><input value={this.props.cameraPositionY}/>
                </form>
            </div>
        )
    }
}

export default CameraPositionComponent;