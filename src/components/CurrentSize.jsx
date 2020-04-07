import React, { Component } from 'react';
import reactCSS from 'reactcss';

class CurrentSize extends Component {

    handleBrushSize = (int) => {
        if( int < 15){
            return "XS";
        } else if( int < 35 ) {
            return "S";
        } else if( int < 70 ) {
            return "M";
        } else if( int < 150 ) {
            return "L";
        } else if ( int <= 200 ) {
            return "XL";
        }
    }

    render() {
        
        const styles = reactCSS({
            'default': {
                color: {
                    width: '40px',
                    height: '40px',
                    borderRadius: '23px',
                    boxSizing: 'border-box',
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
                  boxSizing: 'border-box',
                  fontFamily: 'Campton Bold',
                  fontSize: '2rem',
                  textAlign: 'center',
                  lineHeight: '1.4'
                }
            }
        });

        return (
            <div
                style={styles.swatch}
                onClick={this.props.handleSizeClick}
                className="current-size"
            >
                <div style={styles.color}>{this.handleBrushSize(this.props.brushSize)}</div>
            </div>
        )
    };
}

export default CurrentSize;