import React, { useEffect, useState } from "react";
import { api } from "./api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../../App.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import { Add, Delete, Search } from "@mui/icons-material";
import { Container } from "@mui/system";

const LIMIT = 5;

export function LeadList() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchparams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState();
  const [value, setvalue] = useState("");
  const [page, setPage] = useState(Number(searchparams.get("page") || 1));
  const navigate = useNavigate();
  const handleDelete = () => {
    if (deleteId) {
      const lead = data.find((d) => d.id === deleteId);
      api.deleteLeads([{ id: deleteId, version: lead.version }]).then((res) => {
        if (res) {
          setData((data) => data.filter((d) => d.id !== deleteId));
        }
      });
      setOpen(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (id) => {
    setOpen(true);
    setDeleteId(id);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (value) {
      let req = {
        data: {
          criteria: [
            {
              fieldName: "firstName",
              operator: "like",
              value,
            },
          ],
        },
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
        fields: [
          "id",
          "name",
          "firstName",
          "enterpriseName",
          "fixedPhone",
          "emailAddress.address",
          "contactDate",
        ],
      };

      api
        .getLeads(req)
        .then(({ data, total }) => {
          setData(data);
          setTotal(total);
        })
        .catch((error) => console.log("error", error));
    }
  };

  useEffect(() => {
    setLoading(true);

    api
      .getLeads({
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
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Button
          onClick={() => navigate("./new")}
          variant="outlined"
          color="secondary"
        >
          <Add color="secondary" />
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextField
            style={{
              marginRight: "1em",
            }}
            id="outlined-basic"
            label="search..."
            variant="outlined"
            onChange={(e) => setvalue(e.target.value)}
            onKeyPress={(e) => {
              if (value && e.key === "Enter") {
                handleSearch(e);
              } else if (e.key === "Enter") {
                api
                  .getLeads({ limit: LIMIT, offset: (page - 1) * LIMIT })
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

      {data ? (
        <>
          {loading ? (
            <Container
              style={{
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="secondary" />
            </Container>
          ) : (
            <>
              <TableContainer style={{ padding: "15px", height: "50vh" }}>
                <Table styles={styles.Table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>Last name</TableCell>
                      <TableCell>First name</TableCell>
                      <TableCell>Enterprise</TableCell>
                      <TableCell>Fixed phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>ContactDate</TableCell>
                      <TableCell>Delete</TableCell>
                      <TableCell>Update</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data?.map((d) => {
                      return (
                        <TableRow key={d.id}>
                          <TableCell>{d.id}</TableCell>
                          <TableCell component="th" scope="row">
                            {d.name}
                          </TableCell>
                          <TableCell>{d.firstName}</TableCell>
                          <TableCell>{d.enterpriseName}</TableCell>

                          <TableCell>{d.fixedPhone}</TableCell>
                          <TableCell>{d["emailAddress.address"]}</TableCell>

                          <TableCell>{d.contactDate}</TableCell>
                          <TableCell>
                            <Delete
                              onClick={() => handleOpen(d.id)}
                              color="secondary"
                            />
                          </TableCell>
                          <TableCell>
                            <ModeEditIcon
                              onClick={() => navigate(`${d.id}`)}
                              color="secondary"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
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
        <center>no data found</center>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Question</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete the selected record(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="success">
            cancel
          </Button>
          <Button
            onClick={() => handleDelete()}
            autoFocus
            variant="outlined"
            color="success"
          >
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LeadList;
