import axios from "axios";

const rest = axios.create({
  baseURL: "/axelor-erp/",
  headers: {
    // Authorization: "Basic YWRtaW46YWRtaW4=",
    "X-CSRF-Token": document.cookie?.split("&")?.[0]?.split("=")?.pop?.(),
    "X-Requested-With": "XMLHttpRequest",
  },
});

export { rest };
