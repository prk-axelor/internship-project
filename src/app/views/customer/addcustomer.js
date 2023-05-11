import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { api } from "./api";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Autocomplete, Grid } from "@mui/material";
import { useDebounce } from "app/services/hooks";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import FlashMessage from "app/services/flash-message";
import Muimobileno from "app/services/mui-mobile";
import MuiPhonenumber from "app/services/mui-phone";

const CustomerForm = () => {
  const { id } = useParams();
  const { fetchCategory, fetchSource, fetchAssign, fetchTeam, fetchLanguage } =
    api;
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    saleTurnover: "",
    nbrEmployees: "",
    webSite: "",
    emailAddress: { address: "" },
    fixedPhone: "",
    mobilePhone: "",
    partnerCategory: "",
    user: "",
    source: "",
    team: "",
    isCustomer: true,
  });

  const [saving, setSaving] = useState(false);
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [assign, setAssign] = useState([]);
  const [category, setCatergory] = useState([]);
  const [source, setSource] = useState([]);
  const [team, setTeam] = useState([]);
  const [language, setLanguage] = useState([]);
  const [success, setSucces] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
    if (name === "image") {
      const file = e.target.files[0];
      setPicture(file);
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        setPicture(e.target.result);
      };
      fileReader.readAsDataURL(file);
    }
    if (name === "address") {
      setCustomer((prevData) => {
        const newData = { ...prevData };
        newData.emailAddress[name] = value;
        return newData;
      });
    }
  };

  const handleSubmit = async (e) => {
    let newdata = {
      ...customer,
      picture,
    };
    e.preventDefault();
    const error = validate(customer);
    setError(error);
    if (Object.keys(error).length === 0) {
      if (id) {
        await api.updateCustomer(id, newdata);
        setSucces(true);
        setSaving(false);
        navigate("../new");
      } else {
        const response = await api.addCustomer(newdata);
        setSaving(false);
        const { data: d, status } = response;
        if (d && status === 0) {
          navigate(`../${d[0].id}`);
        }
      }
    }
  };
  const handleDelete = () => {
    setPicture(null);
  };

  const handleCategoryInputChange = async (e, value) => {
    const response = await fetchCategory(value);
    setCatergory(response?.data?.data);
  };

  const handleCategoryChange = (e, value) => {
    setCustomer({
      ...customer,
      partnerCategory: {
        id: value?.id,
        name: value?.name,
        code: value?.code,
      },
    });
  };
  const debouncedChangeSearch = useDebounce(handleCategoryInputChange);
  const handleSourceInputChange = async (e, value) => {
    const response = await fetchSource(value);
    setSource(response?.data?.data);
  };
  const debouncedSourceChangeSearch = useDebounce(handleSourceInputChange);
  const handleSourceChange = (e, value) => {
    setCustomer({
      ...customer,
      source: {
        id: value?.id,
        name: value?.name,
        code: value?.code,
      },
    });
  };
  const handleAssignChangeSearch = async (e, value) => {
    const response = await fetchAssign(value);
    setAssign(response?.data?.data);
  };
  const debouncedAssignChangeSearch = useDebounce(handleAssignChangeSearch);
  const handleAssignChange = (e, value) => {
    setCustomer({
      ...customer,
      user: {
        id: value?.id,
        fullName: value?.fullName,
        code: value?.code,
      },
    });
  };
  const handleTeamChangeSearch = async (e, value) => {
    const response = await fetchTeam(value);
    setTeam(response?.data?.data);
  };
  const debouncedTeamChangeSearch = useDebounce(handleTeamChangeSearch);
  const handleTeamChange = (e, value) => {
    setCustomer({
      ...customer,
      team: {
        id: value?.id,
        name: value?.name,
        code: value?.code,
      },
    });
  };
  const handleLanguageInputChange = async (e, value) => {
    const response = await fetchTeam(value);
    setAssign(response?.data?.data);
  };
  const debouncedLanguageChangeSearch = useDebounce(handleLanguageInputChange);
  const handleLanguageChange = (e, value) => {
    setCustomer({
      ...customer,
      language: {
        id: value?.id,
        name: value?.name,
        code: value?.code,
      },
    });
  };
  const validate = (customer) => {
    const error = {};
    if (!customer.name) {
      error.name = "name is required";
    }

    return error;
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getCustomer(id).then((data) => {
        setCustomer(data);
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
    fetchOptions(fetchCategory, setCatergory);
    fetchOptions(fetchSource, setSource);
    fetchOptions(fetchAssign, setAssign);
    fetchOptions(fetchTeam, setTeam);
    fetchOptions(fetchLanguage, setLanguage);
  }, [fetchCategory, fetchSource, fetchAssign, fetchTeam, fetchLanguage]);

  if (loading) {
    return (
      <Box sx={{ display: "flex" }} justifyContent="center" margin={20}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }
  return (
    <div>
      <center>{id ? <h1> update Customer</h1> : <h1>add Customer</h1>}</center>
      <Grid container spacing={1} style={{ width: "40%", margin: "0 auto" }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            value={customer.name || ""}
            onChange={handleChange}
            error={error.name ? true : false}
            helperText={error.name ? `${error.name}` : ""}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Turnover"
            type="number"
            name="saleTurnover"
            value={customer.saleTurnover || ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Employee(Nbr)"
            name="nbrEmployees"
            type="number"
            value={customer.nbrEmployees || ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Website"
            name="webSite"
            value={customer.webSite || ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="address"
            value={customer?.emailAddress?.address || ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Muimobileno />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MuiPhonenumber />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={category?.map((a) => {
              return {
                name: a.name,
                id: a.id,
              };
            })}
            getOptionLabel={(option) => option?.name || ""}
            value={customer?.partnerCategory || null}
            fullWidth
            isOptionEqualToValue={(option, value) => {
              return option?.value === value?.value;
            }}
            onChange={handleCategoryChange}
            renderInput={(params) => (
              <TextField {...params} label="categories" />
            )}
            onInputChange={debouncedChangeSearch}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={source}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            getOptionLabel={(option) => {
              return option?.name || "";
            }}
            value={customer?.source || null}
            fullWidth
            onChange={handleSourceChange}
            renderInput={(params) => <TextField {...params} label="source" />}
            onInputChange={debouncedSourceChangeSearch}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={assign}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            getOptionLabel={(option) => {
              return option?.fullName || "";
            }}
            value={customer?.user || null}
            fullWidth
            onChange={handleAssignChange}
            renderInput={(params) => (
              <TextField {...params} label="Assign to" />
            )}
            onInputChange={debouncedAssignChangeSearch}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={team}
            getOptionLabel={(option) => {
              return option?.name || "";
            }}
            onChange={handleTeamChange}
            value={customer?.team || null}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            fullWidth
            renderInput={(params) => <TextField {...params} label="team" />}
            onInputChange={debouncedTeamChangeSearch}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={language}
            getOptionLabel={(option) => {
              return option?.name || "";
            }}
            onChange={handleLanguageChange}
            value={customer?.language || null}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            fullWidth
            renderInput={(params) => <TextField {...params} label="language" />}
            onInputChange={debouncedLanguageChangeSearch}
          />
        </Grid>

        <Grid item sm={6} height={150}>
          <Button variant="contained" component="label" sx={{ mr: 1 }}>
            <FileUploadIcon />
            Upload File
            <input type="file" hidden name="image" onChange={handleChange} />
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
            <img src={picture} alt="author" width={100} height={100} />
          )}
        </Grid>
        <Grid>
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
              disabled={saving}
              variant="outlined"
              color="secondary"
              sx={{ mr: 1 }}
            >
              submit
            </Button>
          )}

          <Button
            onClick={() => navigate("/customer")}
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
  );
};

export default CustomerForm;
