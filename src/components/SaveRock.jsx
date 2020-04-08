import React, { Component } from 'react';

class SaveRock extends Component {

    render() {

        return (
            <div className="save-menu">
                {this.props.saveError.isError && <div className="error-msg">{this.props.saveError.errorMsg}</div>}
                <input 
                    className={`artist-name${this.props.saveError.isError ? " error" : ""}`}
                    placeholder="Enter your name"
                    onChange={e => this.props.changeName(e.target.value)}
                />
                <button 
                    className="save-btn"
                    onClick={this.props.handleOpenModal}
                >Save my painting</button>
            </div>
        )
    };
}

export default SaveRock;