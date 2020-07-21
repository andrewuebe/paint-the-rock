import React, { Component } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

// load Rock SVG
const RockSvg = props => {

  const scale = 1080 / props.containerWidth
  
  return (
    <Image
      image={props.img}
      width={props.containerWidth * scale}
      height={props.containerWidth * scale}
    />
  );
};

export default RockSvg;