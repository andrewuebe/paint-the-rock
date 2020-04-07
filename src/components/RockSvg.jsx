import React, { Component } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

// load Rock SVG
const RockSvg = props => {
  const [image] = useImage(
    "https://assets.ard.northwestern.edu/files/2020/paint-the-rock/therock.svg"
  );
  const scale = 1080 / props.containerWidth
  return (
    <Image
      image={image}
      width={props.containerWidth * scale}
      height={props.containerWidth * scale}
    />
  );
};

export default RockSvg;