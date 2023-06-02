import {
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "./api";
import PaginationIndex from "app/components/pagination";
import Navbar from "app/components/navbar";

const LIMIT = 6;
export function Opportunities() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchparams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchparams.get("page") || 1));
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

        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      };
      api
        .getOpportunites(req)
        .then(({ data }) => {
          setData(data);
          setTotal(1);
        })
        .catch((error) => console.log("error", error));
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);

    api
      .searchOpportunity({
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      })
      .then(({ data, total }) => {
        setData(data);

        setTotal(total);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    setSearchParams({ page, limit: LIMIT });
  }, [page, setSearchParams]);

  return (
    <>
      <Navbar
        onSearch={handleSearch}
        setValue={setValue}
        path="./list"
        add={"./new"}
        view="card"
        value={value}
        api={api.getOpportunites}
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
                width: "100%",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </Container>
          ) : (
            <>
              <h1 align="center">Opportunites</h1>

              <Grid
                item
                container
                margin={4}
                style={{
                  height: "600px",
                  overflow: "scroll",
                  width: "100%",
                  margin: "10px ",
                  flexDirection: "row",
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
                                {d.name}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {d.amount}
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
                                {d && d.probability}
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
          <PaginationIndex
            page={page}
            setPage={setPage}
            total={total}
            limit={LIMIT}
          />
        </>
      ) : (
        <h2 align="center">no data found!!!</h2>
      )}
    </>
  );
}

export default Opportunities;
