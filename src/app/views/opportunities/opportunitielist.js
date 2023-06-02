import React, { useEffect, useState } from "react";
import { api } from "./api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Button, CircularProgress } from "@mui/material";
import { Container } from "@mui/system";
import PaginationIndex from "app/components/pagination";
import Dailogbox from "app/components/dailog";
import Navbar from "app/components/navbar";
import { styled } from '@mui/material/styles';

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
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


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
      .getOpportunites(req)
      .then(({ data }) => {
        setData(data);
        setTotal(1);
      })
      .catch((error) => console.log("error", error));
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
      <Navbar
        onSearch={handleSearch}
        setValue={setValue}
        path="../"
        add={"../new"}
        view="list"
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
              <h1 align="center">Opportunites</h1>

              <TableContainer style={{ padding: "15px", height: "60vh" }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Reference</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Amount</StyledTableCell>
                      <StyledTableCell>Expected Close Date</StyledTableCell>
                      <StyledTableCell>Assign To</StyledTableCell>
                      <StyledTableCell>Customer</StyledTableCell>

                      <StyledTableCell>Delete</StyledTableCell>
                      <StyledTableCell>Update</StyledTableCell>
                    </StyledTableRow>
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

                            <TableCell>{d.amount}</TableCell>
                            <TableCell>{d.expectedCloseDate}</TableCell>
                            <TableCell>{d.user && d.user.fullName}</TableCell>
                            <TableCell>
                              {d.partner && d.partner.fullName}
                            </TableCell>
                            <TableCell>
                              <Button color="error" variant="contained" onClick={() => handleOpen(d.id)}>
                                <DeleteIcon
                                /></Button>
                            </TableCell>
                            <TableCell>
                              <Button color="secondary" variant="contained" onClick={() =>
                                navigate(`../${d.id}`, {
                                  state: { view: "list" },
                                })
                              }>
                                <ModeEditIcon


                                />

                              </Button>

                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
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

      <Dailogbox
        openBox={open}
        closeBox={handleClose}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Opportunitielist;
