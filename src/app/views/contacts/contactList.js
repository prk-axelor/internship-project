import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import React, { useEffect, useState } from "react";
import { api } from "./api";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Add, Delete, Search } from "@mui/icons-material";
import { Container } from "@mui/system";
const LIMIT = 5;
const ContactList = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [searchparams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchparams.get("page")) || 1);
  const [loading, setLoading] = useState(false);
  const [value, setvalue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchContact = () => {
      api
        .getContacts({ limit: LIMIT, offset: (page - 1) * LIMIT })
        .then(({ data, total }) => {
          setTotal(total);
          setData(data);
          setLoading(false);
        });
    };
    fetchContact();
  }, [page]);

  useEffect(() => {
    setSearchParams({ page, limit: LIMIT });
  }, [page, setSearchParams]);

  const handleOpen = (id) => {
    setOpen(true);
    setId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    if (id) {
      const contact = data.find((d) => d.id === id);
      api.deleteContact([{ id, version: contact.version }]).then((data) => {
        if (data) {
          setData((data) => data.filter((d) => d.id !== id));
        }
      });
    }
    setOpen(false);
  };
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
        },
      };
      api
        .getContacts(req)
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
          <Button onClick={() => navigate("../new")} variant="outlined">
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
          <DashboardIcon onClick={() => navigate("../")} color="secondary" />
        </Button>
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
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Reference</TableCell>
                      <TableCell> Name</TableCell>
                      <TableCell>Mobile phone</TableCell>
                      <TableCell>Fixed phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Main company</TableCell>

                      <TableCell>Delete</TableCell>
                      <TableCell>Update</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data?.map((d) => {
                      return (
                        <TableRow key={d.id}>
                          <TableCell>{d.partnerSeq}</TableCell>
                          <TableCell component="th" scope="row">
                            {d.simpleFullName}
                          </TableCell>
                          <TableCell>{d.fixedPhone}</TableCell>
                          <TableCell>{d.mobilePhone}</TableCell>

                          <TableCell>{d["emailAddress.address"]}</TableCell>

                          <TableCell>
                            {d["mainPartner.simpleFullName"]}
                          </TableCell>
                          <TableCell>
                            <Delete
                              color="secondary"
                              onClick={() => handleOpen(d.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <ModeEditIcon
                              onClick={() => navigate(`../${d.id}`)}
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
};

export default ContactList;
