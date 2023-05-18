import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { api } from "./api";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Box from "@mui/material/Box";
import { Autocomplete, CircularProgress, Grid } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "app/services/hooks";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import MuiPhonenumber from "app/components/mui-phone";

import FlashMessage from "../../components/flash-message";
const path = {
  card: "contacts",
  list: "contacts/list",
};

const Contactform = () => {
  const { fetchJob, fetchAddress } = api;
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState({});
  const [SearchJobTitle, setSearchJobTitle] = useState([]);
  const [address, setSearchAddress] = useState([]);
  const [view, setView] = useState("");
  const { state } = useLocation();
  useEffect(() => {
    setView(state?.view);
  }, [state?.view]);

  const [data, setData] = useState({
    firstName: "",
    functionBusinessCard: "",
    timeSlot: "",
    fixedPhone: "",
    mobilePhone: "",
    name: "",
    emailAddress: { address: "" },
    picture: [],
    jobTitleFunction: "",
    mainAddress: "",
    isContact: "true",
  });
  const [success, setSucces] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => {
      return { ...prevData, [name]: value };
    });

    if (name === "address") {
      setData((prevData) => {
        const newData = { ...prevData };
        setData({
          ...data,
          emailAddress: {
            address: value,
          },
        });
        return newData;
      });
    }
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const res = await api.imageUploader(file);
    setPicture(res);

    // console.log(res);
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      setPicture(file);
    };

    // await api.fetchImage(id, res?.id);

    //fileReader.readAsDataURL(res?.data?.data[0]);
  };
  // const privewImage = api.fetchImage(id, picture?.id);
  //console.log({ picture });

  const handleDelete = () => {
    setPicture(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newdata = {
      ...data,
      picture: {
        id: picture?.id,
      },
    };
    const errors = validate(data);
    setError(errors);
    if (Object.keys(errors).length === 0) {
      if (id) {
        await api.updateContact(id, newdata);
        setSaving(false);
        setSucces(true);
      } else {
        const response = await api.addContact(newdata);
        setSaving(false);
        const { data: d, status } = response;
        if (d && status === 0) {
          if (view === "card") {
            navigate(`../${d[0].id}`, {
              state: {
                view: "card",
              },
            });
          } else {
            navigate(`../${d[0].id}`, {
              state: {
                view: "list",
              },
            });
          }
        }
      }
    }
  };
  console.log("view", view);
  const handleJobInputchange = async (e, value) => {
    const response = await fetchJob(value);
    setSearchJobTitle(response?.data?.data);
  };
  const debouncedChangeSearch = useDebounce(handleJobInputchange);

  const handleJobChange = async (e, value) => {
    setData({
      ...data,
      jobTitleFunction: value
        ? {
            id: value?.id || "",
            name: value?.name || "",
          }
        : "",
    });
  };
  const handleAddressInput = async (e) => {
    const response = await fetchAddress();
    setSearchAddress(response?.data?.data);
  };
  const debouncedaddressChange = useDebounce(handleAddressInput);

  const handleAddressChange = async (e, value) => {
    setData({
      ...data,
      mainAddress: value
        ? {
            id: value?.id,
            fullName: value?.fullName,
          }
        : "",
    });
  };

  const validate = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = "name is required";
    }

    return errors;
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getContact(id).then((data) => {
        setData(data);
        setLoading(false);
      });
    }
  }, [id]);
  useEffect(() => {
    const fetchOptions = async (method, setter) => {
      const response = await method();
      if (response) {
        setter(response?.data?.data);
      }
    };

    fetchOptions(fetchJob, setSearchJobTitle);
    fetchOptions(fetchAddress, setSearchAddress);
  }, [fetchJob, fetchAddress]);

  if (loading) {
    return (
      <Box sx={{ display: "flex" }} justifyContent="center" margin={20}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <>
      <center>{id ? <h1>update Contact</h1> : <h1>add Contact</h1>}</center>
      <Grid
        item
        container
        spacing={1}
        style={{ width: "50%", margin: "0 auto" }}
      >
        <Grid item sm={6}>
          <MuiPhonenumber
            customer={data}
            setCustomer={setData}
            label="Fixed Phone"
            field="fixedPhone"
          />
        </Grid>
        <Grid item sm={6}>
          <Autocomplete
            options={
              SearchJobTitle?.map((a) => {
                return {
                  name: a?.name || "",
                  id: a?.id || "",
                  code: a?.code || "",
                };
              }) || []
            }
            value={data?.jobTitleFunction || null}
            fullWidth
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => {
              return option?.value === value?.value;
            }}
            onInputChange={debouncedChangeSearch}
            renderInput={(params) => <TextField {...params} label="search" />}
            onChange={handleJobChange}
          />
        </Grid>
        <Grid item sm={6}>
          <TextField
            label="First name"
            variant="outlined"
            name="firstName"
            value={data.firstName || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item sm={6}>
          <TextField
            label="Time Slot"
            name="timeSlot"
            variant="outlined"
            value={data?.timeSlot || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            onChange={handleChange}
            error={error?.name ? true : false}
            helperText={error?.name ? `${error.name}` : ""}
            value={data.name || ""}
            fullWidth
          />
        </Grid>
        <Grid item sm={6}>
          <MuiPhonenumber
            customer={data}
            setCustomer={setData}
            label="Mobile Phone"
            field="mobilePhone"
          />
        </Grid>

        <Grid item sm={12}>
          <TextField
            label="Email"
            name="address"
            value={data?.emailAddress?.address || ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item sm={12}>
          <Autocomplete
            options={
              address?.map((a) => {
                return {
                  id: a?.id,
                  fullName: a?.fullName,
                };
              }) || []
            }
            value={data?.mainAddress || null}
            fullWidth
            getOptionLabel={(option) => {
              return (option.id && `${option?.fullName}-${option?.id}`) || "";
            }}
            isOptionEqualToValue={(option, value) => {
              return option?.value === value?.value;
            }}
            onInputChange={debouncedaddressChange}
            renderInput={(params) => <TextField {...params} label="address" />}
            onChange={handleAddressChange}
          />
        </Grid>

        <Grid item sm={6} height={150}>
          <Button variant="contained" component="label" sx={{ mr: 1 }}>
            <FileUploadIcon />
            Upload File
            <input type="file" hidden name="picture" onChange={handleUpload} />
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
        <Grid item xs={12} sm={6}>
          {picture && (
            <img
              src={`/ws/rest/com.axelor.meta.db.MetaFile/${picture?.id}/content/download?image=true&v=0&parentId=${id}&parentModel=com.axelor.meta.db.MetaFile`}
              alt=""
              width={100}
              height={100}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          {id ? (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={saving}
              variant="outlined"
              color="secondary"
              sx={{ mr: 1 }}
            >
              update
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="outlined"
              disabled={saving}
              color="secondary"
              sx={{ mr: 1 }}
            >
              submit
            </Button>
          )}
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            color="secondary"
            sx={{ mr: 1 }}
          >
            back
          </Button>
        </Grid>
      </Grid>

      {success ? (
        <FlashMessage
          path={view === "card" ? `${path.card}` : `${path.list}`}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Contactform;
