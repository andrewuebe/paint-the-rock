import React, { Component } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

// load Previous Rock
const PrevRock = props => {
  const [image] = useImage(
    props.imgData
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

export default PrevRock;