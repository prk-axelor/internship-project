import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "./api";
import { Button, CircularProgress, Container, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ListIcon from "@mui/icons-material/List";
import { Add, Search } from "@mui/icons-material";

const LIMIT = 6;

export function ContactsCard() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchparams, setSearchParams] = useSearchParams();
  const [value, setvalue] = useState("");

  const [page, setPage] = useState(Number(searchparams.get("page")) || 1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .searchContacts({
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (value) {
      let req = {
        data: {
          operator: "or",

          criteria: [
            {
              fieldName: "simpleFullName",
              operator: "like",
              value,
            },
          ],
          model: "com.axelor.apps.base.db.Partner",
        },
      };
      api
        .searchContacts(req)
        .then(({ data }) => {
          setData(data);
          setTotal(1);
        })
        .catch((error) => console.log("error", error));
    }
  };

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
                    .getContacts({ limit: LIMIT, offset: (page - 1) * LIMIT })
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
                                {d.id}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {d.simpleFullName}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {d.mobilePhone}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {d["emailAddress.address"]}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {d.fixedPhone}
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
    </>
  );
}

export default ContactsCard;
