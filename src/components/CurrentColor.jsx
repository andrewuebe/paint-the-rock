import React, { Component } from 'react';
import reactCSS from 'reactcss';

class CurrentColor extends Component {

    render() {
        
        const styles = reactCSS({
            'default': {
                color: {
                    width: '40px',
                    height: '40px',
                    borderRadius: '23px',
                    background: this.props.curColor,
                    boxSizing: 'border-box',
                    border: '1px solid rgba(0,0,0,0.1)',
                },
                swatch: {
                  padding: '10px',
                  borderRadius: '38px',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  display: 'block',
                  cursor: 'pointer',
                  zIndex: '9999',
                  position: 'relative',
                  boxSizing: 'border-box'
                }
            }
        });

        return (
            <div
                style={styles.swatch}
                onClick={this.props.handleColorClick}
                className="current-color"
            >
                <div style={styles.color}></div>
            </div>
        )
    };
}

export default CurrentColor;