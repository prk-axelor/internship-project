import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "./api";
import ListIcon from "@mui/icons-material/List";
import Pagination from "@mui/material/Pagination";
import { Add, Search } from "@mui/icons-material";

const LIMIT = 6;
export function Opportunities() {
  const [data, setData] = useState([]);
  const [value, setvalue] = useState("");
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
                    .getOpportunites({
                      limit: LIMIT,
                      offset: (page - 1) * LIMIT,
                    })
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
              <Grid
                item
                container
                margin={4}
                style={{
                  height: "675px",
                  overflow: "scroll",
                  width: "100%",
                  margin: "10px ",
                  flexDirection: "row",
                }}
              >
                {data?.map((d) => {
                  return (
                    <Grid item xs={4} sm={4} md={6} key={d.id}>
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
                                {d?.probability}
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
        <div>
          <center>no records found</center>
        </div>
      )}
    </>
  );
}

export default Opportunities;
