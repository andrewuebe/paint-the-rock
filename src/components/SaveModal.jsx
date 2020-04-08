import React, { Component } from 'react';

class SaveModal extends Component {

    render() {

        return (
            <div className="save-modal">
                <div className="modal-header">Are you sure you want to save?</div>
                <p>By saving and submitting you will share your creation with the public. Any hate speech, or mature content will not be toleratead, and will be removed accordingly.</p>
                <button 
                    className="save-btn"
                    onClick={this.props.handleSaveRock}
                >Save</button>
                <button
                    className="report-painting"
                    onClick={this.props.handleCloseModal}
                >Cancel</button>
            </div>
        )
    };
}

export default SaveModal;