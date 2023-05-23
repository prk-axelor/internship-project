import React, { useEffect, useState } from "react";
import { api } from "./api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { CircularProgress } from "@mui/material";
import { Container } from "@mui/system";
import PaginationIndex from "app/components/pagination";
import Dailogbox from "app/components/dailog";
import Navbar from "app/components/navbar";
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
              <TableContainer style={{ padding: "15px", height: "50vh" }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Reference</TableCell>
                      <TableCell>Name</TableCell>
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

                            <TableCell>{d.amount}</TableCell>
                            <TableCell>{d.expectedCloseDate}</TableCell>
                            <TableCell>{d.user && d.user.fullName}</TableCell>
                            <TableCell>
                              {d.partner && d.partner.fullName}
                            </TableCell>
                            <TableCell>
                              <DeleteIcon
                                color="secondary"
                                onClick={() => handleOpen(d.id)}
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
