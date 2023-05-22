import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const AutoComplete = ({
  options,
  value,
  label,
  onchange,
  name,
  onInputChange,
}) => {
  return (
    <>
      <Autocomplete
        options={options}
        getOptionLabel={name}
        value={value}
        fullWidth
        isOptionEqualToValue={(option, value) => {
          return option?.value === value?.value;
        }}
        renderInput={(params) => <TextField {...params} label={label} />}
        onChange={onchange}
        onInputChange={onInputChange}
      />
    </>
  );
};

export default AutoComplete;
