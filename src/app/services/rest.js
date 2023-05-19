import axios from "axios";
//import { login } from "./login";
const token = localStorage.getItem("aop-csrf-token");
const rest = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRF-Token": localStorage.getItem("aop-csrf-token"),
  },
});

const reqBody = {
  username: "admin",
  password: "admin",
};
if (!token) {
  axios.post("/callback", reqBody).then((res) => {
    console.log("res >>>", res);
    if (res.status === 200) {
      const csrf = res.headers.get("x-csrf-token");
      console.log("csrf", csrf);
      localStorage.setItem("aop-csrf-token", csrf);
      return true;
    }
    return false;
  });
}

axios.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("aop-csrf-token");
    console.log("tokem >>>", token);
    if (token) {
      config.headers["'X-CSRF-TOKEN'"] = token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
export { rest };
