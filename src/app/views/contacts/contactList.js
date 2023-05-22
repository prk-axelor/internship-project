import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { api } from "./api";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import { Container } from "@mui/system";
import PaginationIndex from "app/components/pagination";
import Dailogbox from "app/components/dailog";
import Navbar from "app/components/navbar";
const LIMIT = 5;
const ContactList = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [searchparams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(searchparams.get("page")) || 1);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
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
  };

  return (
    <div>
      <Navbar
        onSearch={handleSearch}
        setValue={setValue}
        path="../"
        add={"../new"}
        view="list"
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
              <TableContainer
                style={{
                  padding: "15px",
                  height: "50vh",
                }}
              >
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
                        <TableRow key={d?.id}>
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
                              onClick={() => handleOpen(d?.id)}
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

export default ContactList;
