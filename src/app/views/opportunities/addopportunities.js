import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "./api";
import { useDebounce } from "app/services/hooks";
import FlashMessage from "app/components/flash-message";
import Buttons from "app/components/button";
import Footerbutton from "app/components/footerbutton";

const Addopportunities = () => {
  const { id } = useParams();
  const { fetchCurrency, fetchSource, fetchOppertunityType } = api;
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    nextStep: "",
    probability: "",
    amount: "",
    bestCase: "",
    worstCase: "",
    createdOn: "",
    expectedCloseDate: "",
    currency: "",
    source: "",
    opportunityType: "",
  });
  const [source, setSource] = useState([]);
  const [currency, setcurrency] = useState([]);
  const [oppertunity, setOppertunity] = useState([]);
  const [success, setSucces] = useState(false);
  const { state } = useLocation();
  const [view, setView] = useState("");
  const path = {
    card: "opportunities",
    list: "opportunities/list",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleCurrencyInputChange = async (e, value) => {
    const response = await fetchCurrency(value);
    setcurrency(response?.data?.data);
  };
  const debounceCurrencySearch = useDebounce(handleCurrencyInputChange);
  const handleCurrencyChange = (e, value) => {
    setData({
      ...data,
      currency: value
        ? {
            id: value?.id,
            name: value?.name,
            code: value?.code,
          }
        : "",
    });
  };
  const handleSourceInputChange = async (e, value) => {
    const response = await fetchSource(value);
    setSource(response?.data?.data);
  };
  const debouncedSourceSearch = useDebounce(handleSourceInputChange);
  const handleSourceChange = (e, value) => {
    setData({
      ...data,
      source: value
        ? {
            id: value?.id,
            name: value?.name,
            code: value?.code,
          }
        : "",
    });
  };
  const handleTypeInputChange = async (e, value) => {
    const response = await fetchOppertunityType(value);
    setOppertunity(response?.data?.data);
  };
  const debouncedOppertunitySearch = useDebounce(handleTypeInputChange);

  const handleTypeChange = (e, value) => {
    setData({
      ...data,
      opportunityType: value
        ? {
            id: value?.id,
            name: value?.name,
            code: value?.code,
          }
        : "",
    });
  };
  useEffect(() => {
    setView(state.view);
  }, [state.view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(data);
    setErrors(errors);

    if (!errors) {
      return;
    }
    if (Object.keys(errors)?.length === 0) {
      if (id) {
        await api.updateOpportunity(id, data);
        setSaving(false);
        setSucces(true);
      } else {
        const response = await api.addOpportunites(data);
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
  useEffect(() => {
    const fetchOptions = async (method, setter) => {
      const response = await method();
      if (response) {
        setter(response?.data?.data);
      }
    };
    fetchOptions(fetchCurrency, setcurrency);

    fetchOptions(fetchSource, setSource);
    fetchOptions(fetchOppertunityType, setOppertunity);
  }, [fetchCurrency, fetchSource, fetchOppertunityType]);

  useEffect(() => {
    if (id) {
      setLoading(true);

      api.getOpportunity(id).then((data) => {
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
  const validate = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = "following name are invalid";
    }
    return errors;
  };

  return (
    <div className="container mt-5">
      <div className="add">
        <center>
          {id ? <h1>update oppertunites</h1> : <h1>Submit oppertunites</h1>}
        </center>

        <Grid container spacing={1} style={{ width: "40%", margin: "0 auto" }}>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Name"
              variant="outlined"
              disabled={saving}
              name="name"
              error={errors?.name ? true : false}
              helperText={errors?.name ? `${errors.name}` : ""}
              value={data?.name || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Probability(%)"
              disabled={saving}
              name="probability"
              value={data?.probability || ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Amount"
              variant="outlined"
              disabled={saving}
              name="amount"
              value={data?.amount || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Best case"
              type="number"
              disabled={saving}
              variant="outlined"
              name="bestCase"
              value={data?.bestCase || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Worst case"
              disabled={saving}
              name="worstCase"
              value={data?.worstCase || ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              type="date"
              disabled={saving}
              name="expectedCloseDate"
              value={data?.expectedCloseDate || ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              title="currency"
              onChange={handleCurrencyChange}
              value={data?.currency || null}
              onInputChange={debounceCurrencySearch}
              noOptionsText="No Records"
              isOptionEqualToValue={(option, value) =>
                option?.value === value?.value
              }
              renderInput={(params) => (
                <TextField {...params} label="currency" />
              )}
              getOptionLabel={(option) => {
                return (option.id && `${option.name}-${option.code}`) || "";
              }}
              options={
                currency?.map((a) => {
                  return {
                    name: a.name,
                    id: a.id,
                    code: a.code,
                  };
                }) || []
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={
                source?.map((a) => {
                  return {
                    name: a?.name,
                    id: a?.id,
                  };
                }) || []
              }
              getOptionLabel={(option) => option?.name || ""}
              value={data?.source || null}
              fullWidth
              onInputChange={debouncedSourceSearch}
              isOptionEqualToValue={(option, value) => {
                return option?.value === value?.value;
              }}
              onChange={handleSourceChange}
              renderInput={(params) => <TextField {...params} label="source" />}
            />
          </Grid>

          <Grid item sm={12}>
            <Footerbutton handleSubmit={handleSubmit} saving={saving} />
          </Grid>
        </Grid>
        {success ? (
          <FlashMessage
            path={view === "card" ? `${path.card}` : `${path.list}`}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Addopportunities;
