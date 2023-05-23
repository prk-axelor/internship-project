import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";

const Navbar = ({
  onSearch,
  setValue,
  path,
  add,
  view,
  value,
  api,
  limit,
  page,
  setData,
  setTotal,
}) => {
  const navigate = useNavigate();
  const list = path?.includes("list");
  const [listView, setListView] = useState();
  useEffect(() => {
    setListView(list);
  }, [list]);

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
          <Button
            onClick={() => {
              navigate(`${add}`, { state: { view: `${view}` } });
            }}
            variant="outlined"
          >
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
              onChange={(e) => setValue(e.target.value)}
              style={{ marginRight: "1em" }}
              onKeyPress={(e) => {
                if (value && e.key === "Enter") {
                  onSearch(e);
                } else if (e.key === "Enter") {
                  api({ limit, offset: (page - 1) * limit }).then(
                    ({ data, total }) => {
                      setData(data);
                      setTotal(total);
                    }
                  );
                }
              }}
            />
            <Button onClick={onSearch} variant="outlined">
              <Search color="secondary" />
            </Button>
          </div>
        </div>
        {path &&
          (listView ? (
            <Button onClick={() => navigate(`${path}`)} variant="outlined">
              <ListIcon color="secondary" />
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => navigate(`${path}`)}>
              <DashboardIcon color="secondary" />
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
