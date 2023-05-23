import React from "react";
import TextField from "@mui/material/TextField";
import { api } from "./api";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Autocomplete, Grid } from "@mui/material";
import { useDebounce } from "app/services/hooks";
import FlashMessage from "app/components/flash-message";
import MuiPhonenumber from "app/components/mui-phone";
import Pictureuploader from "app/components/pictureuploader";
import Footerbutton from "app/components/footerbutton";

const path = {
  card: "customer",
  list: "customer/list",
};

const CustomerForm = () => {
  const { id } = useParams();
  const { fetchCategory, fetchSource, fetchAssign, fetchTeam, fetchLanguage } =
    api;
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    saleTurnover: "",
    taxNbr: "",
    webSite: "",
    emailAddress: { address: "" },
    fixedPhone: "",
    mobilePhone: "",
    partnerCategory: "",
    user: "",
    source: "",
    team: "",
    isCustomer: true,
    picture: [],
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
  const [success, setSuccess] = useState(false);
  const { state } = useLocation();
  const [view, setView] = useState("");

  React.useEffect(() => {
    setView(state?.view);
  }, [state?.view]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });

    if (name === "address") {
      setCustomer((prevData) => {
        const newData = { ...prevData };
        setCustomer({
          ...customer,
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
    setPicture(res?.data?.data[0]);

    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      setPicture(file);
    };
  };
  console.log("picture", picture);
  const handleSubmit = async (e) => {
    let newdata = {
      ...customer,
      picture: {
        id: picture?.id || "",
      },
    };
    e.preventDefault();
    const error = validate(customer);
    setError(error);
    if (Object.keys(error).length === 0) {
      if (id) {
        await api.updateCustomer(id, newdata);
        setSuccess(true);
        setSaving(false);
      } else {
        const response = await api.addCustomer(newdata);
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

  const handleCategoryInputChange = async (e, value) => {
    const response = await fetchCategory(value);
    setCatergory(response?.data?.data);
  };

  const handleCategoryChange = (e, value) => {
    setCustomer({
      ...customer,
      partnerCategory: value
        ? {
            id: value?.id,
            name: value?.name,
            code: value?.code,
          }
        : "",
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
      source: value
        ? {
            id: value?.id,
            name: value?.name,
            code: value?.code,
          }
        : "",
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
      user: value
        ? {
            id: value?.id || "",
            fullName: value?.fullName || "",
            code: value?.code || "",
          }
        : "",
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
      team: value
        ? {
            id: value?.id,
            name: value?.name,
            code: value?.code,
          }
        : "",
    });
  };
  const handleLanguageInputChange = async (e, value) => {
    const response = await fetchLanguage(value);
    setLanguage(response?.data?.data);
  };
  const debouncedLanguageChangeSearch = useDebounce(handleLanguageInputChange);
  const handleLanguageChange = (e, value) => {
    setCustomer({
      ...customer,
      language: value
        ? {
            id: value?.id,
            name: value?.name,
            code: value?.code,
          }
        : "",
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
        setPicture(data?.picture);
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
            value={customer?.name || ""}
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
            value={customer?.saleTurnover || ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="taxNbr"
            name="taxNbr"
            type="number"
            value={customer?.taxNbr || ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Website"
            name="webSite"
            value={customer?.webSite || ""}
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
          <MuiPhonenumber
            label="Fixed Phone"
            customer={customer}
            setCustomer={setCustomer}
            field="fixedPhone"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MuiPhonenumber
            label="Mobile Phone"
            customer={customer}
            setCustomer={setCustomer}
            field="mobilePhone"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={
              category?.map((a) => {
                return {
                  name: a?.name,
                  id: a?.id,
                };
              }) || []
            }
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
            options={
              source?.map((a) => {
                return {
                  name: a?.name || "",
                  id: a?.id || "",
                };
              }) || []
            }
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
            options={
              assign?.map((a) => {
                return {
                  fullName: a?.fullName || "",
                  id: a?.id || "",
                  code: a?.code || "",
                };
              }) || []
            }
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
            options={language || []}
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

        <Pictureuploader
          picture={picture}
          setPicture={setPicture}
          handleUpload={handleUpload}
        />
        <Grid>
          <Grid item sm={12}>
            <Footerbutton handleSubmit={handleSubmit} saving={saving} />
          </Grid>
        </Grid>
        {success ? (
          <FlashMessage
            path={view === "card" ? `${path.card}` : `${path.list}`}
          />
        ) : null}
      </Grid>
    </div>
  );
};

export default CustomerForm;
