import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "./api";
import { CircularProgress, Container, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import PaginationIndex from "app/components/pagination";
import Navbar from "app/components/navbar";

const LIMIT = 6;

export function ContactsCard() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchparams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState("");

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
      <Navbar
        onSearch={handleSearch}
        setValue={setValue}
        path="./list"
        add={"./new"}
        view="card"
        value={value}
        api={api.getContacts}
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
                          sx={{ height: 195 }}
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

export default ContactsCard;
