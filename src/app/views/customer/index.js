import { useEffect, useState } from "react";
import { api } from "./api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useNavigate, useSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Pagination from "@mui/material/Pagination";
import Dailogbox from "app/components/dailog";
import Navbar from "app/components/navbar";
import { Container } from "@mui/material";

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
              <TableContainer style={{ height: "50vh", width: "100%" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Reference</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Fixed Phone</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>FiscalPosition</TableCell>
                      <TableCell>Registration code</TableCell>
                      <TableCell>Address</TableCell>

                      <TableCell>Companies</TableCell>

                      <TableCell>Delete</TableCell>

                      <TableCell>Update</TableCell>
                    </TableRow>
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
                            <DeleteIcon
                              onClick={() => handleOpen(d.id)}
                              color="secondary"
                            />
                          </TableCell>
                          <TableCell>
                            <ModeEditIcon
                              onClick={() =>
                                navigate(`../${d.id}`, {
                                  state: { view: "list" },
                                })
                              }
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
