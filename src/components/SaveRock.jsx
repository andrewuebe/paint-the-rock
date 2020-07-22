import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

class SaveRock extends Component {
    constructor(props){
        super(props)
        this.state = {
            imgDataToShare: ""
        }
    }
  handleHover = () => {
    var finalCanvas = document.getElementsByTagName("canvas");
    var finalCanvas = finalCanvas[0];
    var finalDataURL = finalCanvas.toDataURL("image/png");
    this.setState({ imgDataToShare: finalDataURL });
  }
  render() {
    const saveInput = (
      <div>
        {this.props.saveError.isError && (
          <div className="error-msg">{this.props.saveError.errorMsg}</div>
        )}
        <input
          className={`artist-name${
            this.props.saveError.isError ? " error" : ""
          }`}
          placeholder="Enter your name"
          onChange={(e) => this.props.changeName(e.target.value)}
        />
        <button className="save-btn" onClick={this.props.handleOpenModal}>
          Save my painting
        </button>
      </div>
    );

    const sharePainting = (
      <div>
        <div className="last-save-name">
          Thanks for submitting your painting!
        </div>
        <div className="social-instructions">
          Want to share your masterpiece with other ’Cats? Click the icons below
          to generate a prepopulated message to share, or to download an image of your rock
          painting.
        </div>
        <div className="social-links">
          <a
            target="_blank"
            href={`https://twitter.com/intent/tweet?url=https%3A%2F%2Fpainttherock.net%2Fshare-rock%2F${this.props.prevPaintingId}&text=I%20painted%20the%20the%20Digital%20Purple%20Rock%21&hashtags=PurplePride%20%23NAA`}
            className="social-links__twitter"
          >
            <FontAwesomeIcon icon={faTwitter} size="4x" />
            Twitter
          </a>
          <a
            target="_blank"
            href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpainttherock.net%2Fshare-rock%2F${this.props.prevPaintingId}`}
            className="social-links__fb"
            onClick={this.handleFacebookShare}
            >
            <FontAwesomeIcon icon={faFacebook} size="4x" />
            Facebook
          </a>
          <a
            download={`my-painting-of-the-rock.png`}
            href={this.state.imgDataToShare}
            className="social-links__download"
            onMouseOver={this.handleHover}
            >
            <FontAwesomeIcon icon={faDownload} size="4x" />
            Download
          </a>
        </div>
      </div>
    );
    return (
      <div className="save-menu">
        {!this.props.paintingSaved ? saveInput : sharePainting}
      </div>
    );
  }
}

export default SaveRock;
