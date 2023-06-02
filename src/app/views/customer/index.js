import { useEffect, useState } from "react";
import { api } from "./api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from '@mui/material/styles';


import { useNavigate, useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Dailogbox from "app/components/dailog";
import Navbar from "app/components/navbar";
import { Button, Container } from "@mui/material";
import PaginationIndex from "app/components/pagination";

const LIMIT = 5;

export function CustomerList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchparams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(searchparams.get("page")) || 1);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [value, setValue] = useState("");
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

  const offset = (page - 1) * LIMIT;
  useEffect(() => {
    setLoading(true);

    api
      .getCustomers({
        limit: LIMIT,
        offset,
      })
      .then(({ data, total }) => {
        setData(data);

        setTotal(total);
        setLoading(false);
      });
  }, [offset, page]);

  const handleDelete = () => {
    const Customer = data.find((d) => d.id === deleteId);

    if (deleteId) {
      api
        .delCustomer([{ id: deleteId, version: Customer.version }])
        .then((res) => {
          if (res) {
            setData((data) => data.filter((d) => d.id !== deleteId));
          }
          setOpen(false);
        });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (id) => {
    setOpen(true);
    setDeleteId(id);
  };

  useEffect(() => {
    setSearchParams({ page, limit: LIMIT });
  }, [page, setSearchParams]);

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
      offset,
      limit: LIMIT,
    };
    api
      .getCustomers(req)
      .then(({ data, total }) => {
        setData(data);
        setTotal(total);
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <>
      <Navbar
        onSearch={handleSearch}
        setValue={setValue}
        path="../"
        add={"../new"}
        view="list"
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
              <h1 align="center">Customers</h1>
              <TableContainer style={{ height: "60vh", width: "100%" }}>
                <Table stickyHeader>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Reference</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Fixed Phone</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Category</StyledTableCell>
                      <StyledTableCell>FiscalPosition</StyledTableCell>
                      <StyledTableCell>Registration code</StyledTableCell>
                      <StyledTableCell>Address</StyledTableCell>

                      <StyledTableCell>Companies</StyledTableCell>

                      <StyledTableCell>Delete</StyledTableCell>

                      <StyledTableCell>Update</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {data?.map((d) => {
                      return (
                        <TableRow key={d.id}>
                          <TableCell>{d.partnerSeq}</TableCell>
                          <TableCell>{d.name}</TableCell>
                          <TableCell>{d.fixedPhone}</TableCell>
                          <TableCell>{d["emailAddress.address"]}</TableCell>
                          <TableCell>{d["partnerCategory.name"]}</TableCell>
                          <TableCell>{d["fiscalPosition.code"]}</TableCell>
                          <TableCell>{d && d.registrationCode}</TableCell>
                          <TableCell>{d["mainAddress.fullName"]}</TableCell>

                          <TableCell>{d.companyStr}</TableCell>
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
    </>
  );
}

export default CustomerList;
