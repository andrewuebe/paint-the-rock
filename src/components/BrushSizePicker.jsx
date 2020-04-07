import React from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

function valueLabelFormat(value) {
  return `${Math.round(value)}`;
}

export default function BrushSizePicker(props) {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.handleSizeChange(newValue);
  };

  return (
    <div>
      <Typography id="non-linear-slider" gutterBottom>
        Move the slider to change the brush size:
      </Typography>
      <Slider
        defaultValue={Math.floor( Math.sqrt(props.curBrushSize / 0.005) )}
        min={1}
        step={1}
        max={200}
        scale={(x) => Math.ceil(0.005*(x*x))}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="non-linear-slider"
      />
    </div>
  );
}
