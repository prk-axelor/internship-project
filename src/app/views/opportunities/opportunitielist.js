import React, { useEffect, useState } from "react";
import { api } from "./api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  TextField,
} from "@mui/material";
import { Add, Delete, Search } from "@mui/icons-material";
import { Container } from "@mui/system";
const LIMIT = 5;
const Opportunitielist = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState();
  const [open, setOpen] = useState(false);
  const [searchparams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchparams.get("page") || 1));
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    if (deleteId) {
      const lead = data.find((d) => d.id === deleteId);
      api
        .deleteOppertunity([{ id: deleteId, version: lead.version }])
        .then((res) => {
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
        .getOpportunites(req)
        .then(({ data }) => {
          setData(data);
          setTotal(1);
        })
        .catch((error) => console.log("error", error));
    }
  };
  useEffect(() => {
    setLoading(true);
    api
      .getOpportunites({
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      })
      .then(({ data, total }) => {
        setData(data);
        setLoading(false);
        setTotal(total);
      });
  }, [page]);
  useEffect(() => {
    setSearchParams({ page, limit: LIMIT });
  }, [page, setSearchParams]);

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
              style={{ marginRight: "1em" }}
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
            />
            <Button variant="outlined" onClick={handleSearch}>
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
                      <TableCell>Name</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Expected Close Date</TableCell>
                      <TableCell>Assign To</TableCell>
                      <TableCell>Customer</TableCell>

                      <TableCell>Delete</TableCell>
                      <TableCell>Update</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data &&
                      data?.map((d) => {
                        return (
                          <TableRow key={d.id}>
                            <TableCell>{d.opportunitySeq}</TableCell>
                            <TableCell component="th" scope="row">
                              {d.name}
                            </TableCell>
                            <TableCell>{d["company.name"]}</TableCell>
                            <TableCell>{d.amount}</TableCell>
                            <TableCell>{d.expectedCloseDate}</TableCell>
                            <TableCell>{d["user.fullName"]}</TableCell>
                            <TableCell>{d?.partner?.fullName}</TableCell>
                            <TableCell>
                              <DeleteIcon
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

export default Opportunitielist;
// {data ? (
//   <>
//     <TableContainer style={{ padding: "15px", height: "50vh" }}>
//       <Table aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Reference</TableCell>
//             <TableCell>Name</TableCell>
//             <TableCell>Company</TableCell>
//             <TableCell>Amount</TableCell>
//             <TableCell>Expected Close Date</TableCell>
//             <TableCell>Assign To</TableCell>
//             <TableCell>Customer</TableCell>

//             <TableCell>Delete</TableCell>
//             <TableCell>Update</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {data &&
//             data?.map((d) => {
//               return (
//                 <TableRow key={d.id}>
//                   <TableCell>{d.opportunitySeq}</TableCell>
//                   <TableCell component="th" scope="row">
//                     {d.name}
//                   </TableCell>
//                   <TableCell>{d["company.name"]}</TableCell>
//                   <TableCell>{d.amount}</TableCell>
//                   <TableCell>{d.expectedCloseDate}</TableCell>
//                   <TableCell>{d["user.fullName"]}</TableCell>
//                   <TableCell>{d?.partner?.fullName}</TableCell>
//                   <TableCell>
//                     <DeleteIcon
//                       color="secondary"
//                       onClick={() => handleOpen(d.id)}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <ModeEditIcon
//                       onClick={() => navigate(`../${d.id}`)}
//                       color="secondary"
//                     />
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//         </TableBody>
//       </Table>
//     </TableContainer>

//     <Pagination
//       count={Math.ceil(total / LIMIT)}
//       page={page}
//       onChange={(event, newpage) => setPage(newpage)}
//       color="secondary"
//     />
//   </>
// ) : (
//   <p>no records found</p>
// )}
