import MuiPhoneNumber from "material-ui-phone-number";
import React, { useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";

const Muimobileno = () => {
  const [data, setData] = useState({ mobilePhone: "" });
  const [isValid, setIsValid] = useState(true);
  return (
    <div>
      <MuiPhoneNumber
        label="Mobilephone"
        variant="outlined"
        defaultCountry={"in"}
        value={data?.mobilePhone || ""}
        onChange={(value) => {
          setIsValid(isValidPhoneNumber(value));
          return setData({
            ...data,
            mobilePhone: value,
          });
        }}
        error={!isValid ? true : false}
        helperText={
          data?.mobilePhone.length < 3
            ? ""
            : data?.mobilePhone.length - 1 <= 7
            ? "Too Short"
            : data?.mobilePhone.length >= 8 && !isValid
            ? "Invalid Phone"
            : ""
        }
        fullWidth
      />
    </div>
  );
};

export default Muimobileno;
