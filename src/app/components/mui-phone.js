import MuiPhoneNumber from "material-ui-phone-number";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useState } from "react";

const MuiPhonenumber = ({ customer, setCustomer, field, label }) => {
  const [isValid, setIsValid] = useState(true);

  return (
    <div>
      <MuiPhoneNumber
        label={`${label}`}
        variant="outlined"
        defaultCountry={"in"}
        value={customer[field] || ""}
        onChange={(value) => {
          setIsValid(isValidPhoneNumber(value));
          return setCustomer({
            ...customer,
            [field]: value,
          });
        }}
        error={!isValid ? true : false}
        helperText={
          customer[field]?.length < 3
            ? ""
            : customer[field]?.length - 1 <= 7
            ? "Too Short"
            : customer[field]?.length >= 8 && !isValid
            ? "Invalid Phone"
            : ""
        }
        fullWidth
      />
    </div>
  );
};

export default MuiPhonenumber;
