import { rest } from "../../services/rest";
const model = "ws/rest/com.axelor.apps.base.db.Partner";
const getCustomers = (reqBody = {}) => {
  return rest
    .post(`/${model}/search`, {
      fields: [
        "id",
        "partnerSeq",
        "name",
        "mainAddress.fullName",
        "fixedPhone",
        "emailAddress.address",
        "partnerCategory.name",
        "fiscalPosition.code",
        "registrationCode",
        "companyStr",
        "registrationCode",
      ],
      ...reqBody,
    })
    .then((data) => data?.data);
};

const addCustomer = (data) => {
  return rest.post(`/${model}`, { data }).then((data) => data?.data);
};
const searchCustomer = (data) => {
  return api.getCustomers({
    fields: [
      "id",
      "amount",
      "name",
      "probability",
      "registrationCode",
      "probability",
      "emailAddress.address",
    ],
    ...data,
  });
};
const getCustomer = (id) => {
  return rest
    .post(`/${model}/${id}/fetch`, {
      fields: [
        "id",
        "partnerSeq",
        "name",
        "mainAddress.fullName",
        "fixedPhone",
        "emailAddress",
        "partnerCategory.name",
        "fiscalPosition.code",
        "registrationCode",
        "companyStr",
        "registrationCode",
      ],
      related: {
        emailAddress: ["address"],
      },
    })
    .then(({ data }) => data?.data[0]);
};
const delCustomer = (records) => {
  return rest
    .post(`/${model}/removeAll`, { records })
    .then((data) => data?.data);
};
const updateCustomer = (id, data) => {
  return rest
    .post(`/${model}`, {
      id,
      data,
    })
    .then(({ data }) => data?.data);
};
const fetchCategory = () => {
  return rest.post(
    "/ws/rest/com.axelor.apps.base.db.PartnerCategory/search",

    {
      fields: ["id", "name", "code"],
    }
  );
};
const fetchSource = () => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Source/search", {
    fields: ["id", "name", "code"],
  });
};
const fetchAssign = () => {
  return rest.post("/ws/rest/com.axelor.auth.db.User/search", {
    fields: ["id", "fullName", "partner", "name", "code"],
  });
};
const fetchTeam = () => {
  return rest.post("/ws/rest/com.axelor.team.db.Team/search", {
    fields: ["id", "name", "code"],
  });
};
const fetchLanguage = () => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Language/search", {
    fields: ["id", "name", "code"],
  });
};
const api = {
  getCustomers,
  addCustomer,
  getCustomer,
  delCustomer,
  updateCustomer,
  searchCustomer,
  fetchCategory,
  fetchSource,
  fetchAssign,
  fetchTeam,
  fetchLanguage,
};

export { api };
