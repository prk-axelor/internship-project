import MuiPhoneNumber from "material-ui-phone-number";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useState } from "react";

const Countrycode = () => {
  const [data, setData] = useState([]);
  return (
    <div>
      <MuiPhoneNumber
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
        error={error?.fixedPhone ? true : false}
        helperText={error?.fixedPhone ? `${error.fixedPhone}` : ""}
        fullWidth
      />
    </div>
  );
};

export default Countrycode;
