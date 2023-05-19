export function login() {
  return fetch("open-platform-demo-dev/callback", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify({
      username: "admin",
      password: "admin",
    }),
  }).then((res) => {
    if (res.status === 200) {
      const csrf = res.headers.get("x-csrf-token");
      console.log("csrf", csrf);
      localStorage.setItem("aop-csrf-token", csrf);
      return true;
    }
    return false;
  });
}
