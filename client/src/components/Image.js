import React, { Component } from "react";

class Image extends Component {
  arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  render() {
    const { image } = this.props;
    const imageDataBuffer = image.data.data;
    const base64Image = this.arrayBufferToBase64(imageDataBuffer);
    const imageUrl = `data:${image.contentType};base64,${base64Image}`;
    return <img className='rounded-t-xl' src={imageUrl} alt='Patient Chart' />;
  }
}

export default Image;
