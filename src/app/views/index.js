import { Outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useTranslation } from "app/services/translate";

function Header() {
  const navigate = useNavigate();

  const handleRedirection = (path) => () => {
    navigate(`/${path}`);
  };
  const { t } = useTranslation();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box flexGrow={1}></Box>

        <Box display="flex" alignItems="center">
          <Button
            onClick={handleRedirection("leads")}
            sx={{ mr: 1 }}
            color="secondary"
            variant="contained"
          >
            {t("Leads")}
          </Button>
          <Button
            onClick={handleRedirection("customer")}
            sx={{ mr: 1 }}
            color="secondary"
            variant="contained"
          >
            {t("Customer")}
          </Button>
          <Button
            onClick={handleRedirection("opportunities")}
            sx={{ mr: 1 }}
            color="secondary"
            variant="contained"
          >
            {t("Opportunities")}
          </Button>
          <Button
            onClick={handleRedirection("contacts")}
            color="secondary"
            variant="contained"
          >
            {t("Contacts")}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function Content() {
  return (
    <Box component="main" flexGrow={1}>
      
      <Outlet />
    </Box>
  );
}

function Footer() {
  return (
    <Box
      height="60px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow={2}
      component="footer"
    >
      <Typography color="primary">
        &copy; Copyright 2005 - {new Date().getFullYear()}, Axelor. All Rights
        Reserved.
      </Typography>
    </Box>
  );
}

function Layout() {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Header />
     
      <Content />
      <Footer />
    </Box>
  );
}

export function Index() {
  return (
    <>
      <Layout />
    </>
  );
}

export default Index;
