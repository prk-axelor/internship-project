import MuiPhoneNumber from "material-ui-phone-number";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useState } from "react";

const MuiPhonenumber = () => {
  const [data, setData] = useState({ fixedPhone: "" });
  const [isValid, setIsValid] = useState(true);

  return (
    <div>
      <MuiPhoneNumber
        label="Fixedphone"
        variant="outlined"
        defaultCountry={"in"}
        value={data?.fixedPhone || ""}
        onChange={(value) => {
          setIsValid(isValidPhoneNumber(value));
          console.log(isValid);
          return setData({
            ...data,
            fixedPhone: value,
          });
        }}
        error={!isValid ? true : false}
        helperText={
          data?.fixedPhone.length < 3
            ? ""
            : data?.fixedPhone.length - 1 <= 7
            ? "Too Short"
            : data?.fixedPhone.length >= 8 && !isValid
            ? "Invalid Phone"
            : ""
        }
        fullWidth
      />
    </div>
  );
};

export default MuiPhonenumber;
