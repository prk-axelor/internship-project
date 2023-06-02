import React, { useEffect, useState } from "react";
import { api } from "./api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../../App.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PaginationIndex from "app/components/pagination";
import { Delete } from "@mui/icons-material";
import { Container } from "@mui/system";
import Dailogbox from "app/components/dailog";
import Navbar from "app/components/navbar";
import { styled } from '@mui/material/styles';
import { Button } from "@mui/material";

const LIMIT = 5;

export function LeadList() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchparams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState();
  const [value, setValue] = useState("");
  const [page, setPage] = useState(Number(searchparams.get("page") || 1));
  const navigate = useNavigate();
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

    let req = {
      data: {
        criteria: [
          {
            fieldName: "name",
            operator: "like",
            value: value,
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
      .then(({ data }) => {
        setData(data);
        setTotal(1);
      })
      .catch((error) => console.log("error", error));
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
      <Navbar
        onSearch={handleSearch}
        setValue={setValue}
        add={"./new"}
        view="list"
        value={value}
        api={api.getLeads}
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
              <h1 align="center">Leads</h1>
              <TableContainer style={{ padding: "15px", height: "60vh" }}>
                <Table styles={styles.Table} aria-label="simple table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell >id</StyledTableCell>
                      <StyledTableCell>Last name</StyledTableCell>
                      <StyledTableCell>First name</StyledTableCell>
                      <StyledTableCell>Enterprise</StyledTableCell>
                      <StyledTableCell>Fixed phone</StyledTableCell>
                      <StyledTableCell>Address</StyledTableCell>
                      <StyledTableCell>ContactDate</StyledTableCell>
                      <StyledTableCell>Delete</StyledTableCell>
                      <StyledTableCell>Update</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {data &&
                      data.map((d) => {
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

                              <Button color="error" variant="contained" onClick={() => handleOpen(d.id)}>
                                <Delete />
                              </Button>

                            </TableCell>
                            <TableCell>
                              <Button color="secondary" variant="contained" onClick={() => navigate(`${d.id}`)}>
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
              <PaginationIndex
                page={page}
                setPage={setPage}
                total={total}
                limit={LIMIT}
              />
            </>
          )}
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
}

export default LeadList;
