import React, { Component } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

// load Rock SVG
const RockSvg = props => {
  var [image] = useImage(
    "./therock.svg"
  );
  const scale = 1080 / props.containerWidth
  return (
    <Image
      image={image}
      width={props.containerWidth * scale}
      height={props.containerWidth * scale}
      origin='anonymous'
    />
  );
};

export default RockSvg;