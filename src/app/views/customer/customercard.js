import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "./api";

import { Add, Search } from "@mui/icons-material";
import ListIcon from "@mui/icons-material/List";
import { Container } from "@mui/system";

const LIMIT = 6;
const CustomerCard = () => {
  const [data, setData] = useState([]);
  const [searchparams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [value, setvalue] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(Number(searchparams.get("page") || 1));

  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    const fetchCustomer = () => {
      api
        .searchCustomer({
          limit: LIMIT,
          offset: (page - 1) * LIMIT,
        })
        .then(({ data, total }) => {
          setData(data);

          setTotal(total);
          setLoading(false);
        });
    };
    fetchCustomer();
  }, [page]);

  useEffect(() => {
    setSearchParams({ page, limit: LIMIT });
  }, [page, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (value) {
      let req = {
        data: {
          operator: "or",
          criteria: [
            {
              fieldName: "name",
              operator: "like",
              value,
            },
          ],
        },
      };
      api
        .getCustomers(req)
        .then(({ data }) => {
          setData(data);
          setTotal(1);
        })
        .catch((error) => console.log("error", error));
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={() => navigate("./new")} variant="outlined">
            <Add color="secondary" />
          </Button>
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              id="outlined-basic"
              label="search..."
              variant="outlined"
              onChange={(e) => setvalue(e.target.value)}
              style={{ marginRight: "1em" }}
              onKeyPress={(e) => {
                if (value && e.key === "Enter") {
                  handleSearch(e);
                } else if (e.key === "Enter") {
                  api
                    .getCustomers({ limit: LIMIT, offset: (page - 1) * LIMIT })
                    .then(({ data, total }) => {
                      setData(data);
                      setTotal(total);
                    });
                }
              }}
            />
            <Button onClick={handleSearch} variant="outlined">
              <Search color="secondary" />
            </Button>
          </div>
        </div>
        <Button variant="outlined">
          <ListIcon onClick={() => navigate("./list")} color="secondary" />
        </Button>
      </div>

      {data ? (
        <>
          {loading ? (
            <Container
              style={{
                height: "695px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </Container>
          ) : (
            <>
              <Grid
                item
                container
                margin={4}
                style={{
                  height: "675px",
                  width: "100%",
                  margin: "10px ",
                  flexDirection: "row",
                  overflow: "scroll",
                }}
              >
                {data?.map((d) => {
                  return (
                    <Grid item xs={4} sm={4} md={4} key={d.id}>
                      <Grid item padding={2}>
                        <Card
                          sx={{ height: 185 }}
                          onClick={() => navigate(`${d.id}`)}
                        >
                          <CardActionArea>
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {d.id}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {d.registrationCode}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {d.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {d?.probability}
                              </Typography>
                              <Typography>
                                {d["emailAddress.address"]}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
          <Pagination
            count={Math.ceil(total / LIMIT)}
            page={page}
            onChange={(event, newpage) => setPage(newpage)}
            color="secondary"
          />
        </>
      ) : (
        <p>no records found</p>
      )}
    </div>
  );
};

export default CustomerCard;
