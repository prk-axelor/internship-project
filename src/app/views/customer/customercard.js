import {
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "./api";
import { Container } from "@mui/system";
import Navbar from "app/components/navbar";

const LIMIT = 6;
const CustomerCard = () => {
  const [data, setData] = useState([]);
  const [searchparams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState("");
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
      <Navbar
        onSearch={handleSearch}
        setValue={setValue}
        path="./list"
        add={"./new"}
        view="card"
        value={value}
        api={api.getCustomers}
        limit={LIMIT}
        page={page}
        setData={setData}
        setTotal={setTotal}
      />

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
                          onClick={() =>
                            navigate(`${d.id}`, { state: { view: "card" } })
                          }
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
                                {data && d.probability}
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
        <h2 align="center">no data found!!!</h2>
      )}
    </div>
  );
};

export default CustomerCard;
