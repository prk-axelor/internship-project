import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { api } from "./api";
import { useParams, useNavigate } from "react-router-dom";
import { useDebounce } from "app/services/hooks";
import Grid from "@mui/material/Grid";
import "react-phone-number-input/style.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import FlashMessage from "../../components/flash-message";
import MuiPhonenumber from "app/components/mui-phone";

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchJob, fetchCity, fetchCountry } = api;
  const [data, setData] = useState({
    firstName: "",
    name: "",
    enterpriseName: "",
    emailAddress: { address: "" },
    fixedPhone: "",
    webSite: "",
    mobilePhone: "",
    primaryAddress: "",
    primaryCity: "",
    primaryCountry: "",
    primaryPostalCode: "",
    primaryState: "",
    jobTitleFunction: "",
    // picture: [],
  });

  const [saving, setSaving] = useState(false);
  const [picture, setPicture] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState([]);
  const [city, setCity] = useState([]);
  const [country, setCountry] = useState([""]);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e && e.target;
    console.log({ e });
    setData({
      ...data,
      [name]: value,
    });

    if (name === "picture") {
      const file = e.target.files[0];

      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        setPicture(e.target.result);
      };
      fileReader.readAsDataURL(file);
    }
    if (name === "address") {
      setData({
        ...data,
        emailAddress: {
          address: value,
        },
      });
    }
  };
  const handleDelete = () => {
    setPicture(null);
  };

  const handleJobInputchange = async (e, value) => {
    const response = await fetchJob(value);

    setJobDesc(response?.data?.data);
  };

  const debouncedChangeSearch = useDebounce(handleJobInputchange);
  const handleJobChange = (e, value) => {
    setData({
      ...data,
      jobTitleFunction: {
        id: value?.id || "",
        name: value?.name || "",
      },
    });
  };

  const handleCountryChange = (e, value) => {
    setData({
      ...data,
      primaryCountry: {
        id: value?.id || "",
        name: value?.name || "",
        $version: value?.version || "",
      },
    });
  };
  const handleCityChange = async (e, value) => {
    const response = await api.fecthAction(value?.id, value?.fullName);
    if (response && response.data.status === 0) {
      const Country = await response?.data?.data[0]?.attrs?.primaryCountry
        ?.value;

      const PostalCode = await response?.data?.data[0]?.attrs?.primaryPostalCode
        ?.value;
      setData({
        ...data,
        primaryCity: value
          ? {
              id: value?.id,
              fullName: value?.fullName,
            }
          : "",
        primaryCountry: value
          ? {
              name: Country?.name,
              id: Country?.id,
              $version: Country?.$version,
            }
          : "",
        primaryPostalCode: PostalCode,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newdata = {
      ...data,
      picture,
    };
    const errors = validate(data);
    setErrors(errors);

    if (Object.keys(errors)?.length === 0) {
      if (id) {
        await api.updateLeads(id, newdata);
        setSaving(false);
        setSuccess(true);
        setTimeout(() => {
          navigate("/leads");
        }, 1000);
      } else {
        const response = await api.addLead(newdata);

        const { data: userData, status } = response;
        if (userData && status === 0) {
          navigate(`../${userData[0].id}`);
          setSaving(false);
        }
      }
    }
  };

  const validate = (data) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    if (!data.name) {
      errors.name = "Lastname is required";
    }
    if (!data.emailAddress.address) {
      errors.address = "Email is required";
    } else if (!regex.test(data.emailAddress.address)) {
      errors.address = "Please enter valid email address";
    }

    return errors;
  };
  useEffect(() => {
    const fetchOptions = async (method, setter) => {
      const response = await method();
      if (response) {
        setter(response?.data?.data);
      }
    };
    fetchOptions(fetchJob, setJobDesc);
    fetchOptions(fetchCity, setCity);
    fetchOptions(fetchCountry, setCountry);
  }, [fetchJob, fetchCity, fetchCountry]);

  const countryOps = country?.map((a) => {
    return {
      name: a?.name || "",
      $version: a?.version || "",
      id: a?.id || "",
    };
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getLead(id).then((data) => {
        setData(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex" }} justifyContent="center" margin={20}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  console.log(data);

  return (
    <>
      <div className="container mt-5">
        <div className="add">
          <center>{id ? <h1>update lead</h1> : <h1>Submit leads</h1>}</center>

          <Grid
            container
            spacing={1}
            style={{ width: "40%", margin: "0 auto" }}
          >
            <Grid item sm={6}>
              <TextField
                label="First name"
                variant="outlined"
                name="firstName"
                value={data?.firstName || ""}
                onChange={handleChange}
                error={errors?.firstName ? true : false}
                helperText={errors?.firstName ? `${errors.firstName}` : ""}
                fullWidth
              />
            </Grid>

            <Grid item sm={6}>
              <TextField
                label="Name"
                height={150}
                variant="outlined"
                name="name"
                value={data?.name || ""}
                onChange={handleChange}
                error={errors?.name ? true : false}
                helperText={errors?.name ? `${errors.name}` : ""}
                fullWidth
              />
            </Grid>

            <Grid item sm={6}>
              <TextField
                label="Email"
                name="address"
                value={data?.emailAddress?.address || ""}
                onChange={handleChange}
                variant="outlined"
                error={errors?.address ? true : false}
                helperText={errors?.address ? `${errors.address}` : ""}
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <MuiPhonenumber
                customer={data}
                setCustomer={setData}
                field="fixedPhone"
                label="Fixed Phone"
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                label="Enterprise"
                variant="outlined"
                name="enterpriseName"
                value={data?.enterpriseName || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                label="Website"
                name="webSite"
                value={data?.webSite || ""}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                fullWidth
                label="Address"
                name="primaryAddress"
                value={data?.primaryAddress || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item sm={6}>
              <Autocomplete
                options={city}
                getOptionLabel={(option) => option?.fullName || ""}
                value={data?.primaryCity || null}
                fullWidth
                isOptionEqualToValue={(option, value) => {
                  return option?.value === value?.value;
                }}
                renderInput={(params) => <TextField {...params} label="city" />}
                onChange={handleCityChange}
              />
            </Grid>

            <Grid item sm={6}>
              {data?.primaryCity ? (
                <>
                  <TextField
                    disabled
                    value={data?.primaryCountry?.name || ""}
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <Autocomplete
                    options={countryOps}
                    getOptionLabel={(option) => {
                      return option.name || "";
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value || ""
                    }
                    fullWidth
                    onChange={handleCountryChange}
                    renderInput={(params) => (
                      <TextField {...params} label="country" />
                    )}
                  />
                </>
              )}
            </Grid>
            <Grid item sm={6}>
              <TextField
                value={data?.primaryPostalCode || ""}
                fullWidth
                label="Postalcode"
              />
            </Grid>

            <Grid item sm={6}>
              <Autocomplete
                options={
                  jobDesc?.map((a) => {
                    return {
                      name: a?.name || "",
                      id: a?.id || "",
                    };
                  }) || []
                }
                getOptionLabel={(option) => option?.name || ""}
                value={data?.jobTitleFunction || null}
                fullWidth
                isOptionEqualToValue={(option, value) => {
                  return option?.value === value?.value;
                }}
                renderInput={(params) => (
                  <TextField {...params} label="search" />
                )}
                onInputChange={debouncedChangeSearch}
                onChange={handleJobChange}
              />
            </Grid>

            <Grid item sm={6}>
              <Button variant="contained" component="label" sx={{ mr: 1 }}>
                <FileUploadIcon />
                Upload File
                <input
                  type="file"
                  hidden
                  name="picture"
                  value={data?.picture || ""}
                  onChange={handleChange}
                />
              </Button>
              {picture && (
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  component="label"
                  sx={{ mr: 1 }}
                >
                  <CancelPresentationIcon />
                </Button>
              )}
            </Grid>

            <Grid item sm={6}>
              {picture && (
                <img src={picture} alt="author" width={100} height={100} />
              )}
            </Grid>
            <Grid item sm={6}>
              {id ? (
                <Button
                  type="submit"
                  sx={{ mr: 1 }}
                  onClick={handleSubmit}
                  disabled={saving}
                  variant="outlined"
                  color="secondary"
                >
                  update
                </Button>
              ) : (
                <Button
                  type="submit"
                  sx={{ mr: 1 }}
                  onClick={handleSubmit}
                  disabled={saving}
                  variant="outlined"
                  color="secondary"
                >
                  submit
                </Button>
              )}
              <Button
                onClick={() => navigate("/leads")}
                variant="outlined"
                color="secondary"
                sx={{ mr: 1 }}
              >
                back
              </Button>
            </Grid>
          </Grid>
          {success ? <FlashMessage /> : ""}
        </div>
      </div>
    </>
  );
};

export default LeadForm;
