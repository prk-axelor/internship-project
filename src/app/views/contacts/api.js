import { rest } from "../../services/rest";
const model = "ws/rest/com.axelor.apps.base.db.Partner";
const getContacts = (reqBody = {}) => {
  return rest
    .post(`/${model}/search`, {
      fields: [
        "jobTitleFunction",
        "mobilePhone",
        "simpleFullName",
        "partnerSeq",
        "emailAddress.address",
        "mainPartner.simpleFullName",
        "fixedPhone",
        "mainAddress",
      ],
      ...reqBody,
    })
    .then((data) => data?.data);
};
const addContact = (data) => {
  return rest.post(`/${model}`, { data }).then((data) => data?.data);
};
const getContact = (id) => {
  return rest
    .post(`/${model}/${id}/fetch`, {})
    .then(({ data }) => data?.data[0]);
};
const updateContact = (id, data) => {
  return rest.post(`/${model}`, { id, data }).then(({ data }) => data?.data);
};
const searchContacts = (data) => {
  return getContacts({
    fields: [
      "id",
      "name",
      "functionBusinessCard",
      "timeSlot",
      "fixedPhone",
      "mobilePhone",
      "name",
      "emailAddress.address",
    ],
    ...data,
  });
};
const deleteContact = (records) => {
  return rest
    .post(`/${model}/removeAll`, { records })
    .then((data) => data?.data);
};
const fetchJob = (value) => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Function/search", {
    data: { code: value, name: value },
    fields: ["id", "name", "code"],
  });
};
const fecthAction = async (id, name) => {
  const response = await rest.post(`/ws/action`, {
    model: "com.axelor.apps.base.db.Partner",
    action: "action-record-base-partner-set-business-card",
    data: {
      context: {
        id: id,
        name: name,
      },
    },
  });
  if (response && response.data.status !== -1) {
    return response;
  }
};
const fetchAddress = () => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Address/search", {
    fields: ["id", "fullName"],
  });
};
const api = {
  getContacts,
  addContact,
  getContact,
  updateContact,
  searchContacts,
  deleteContact,
  fetchJob,
  fecthAction,
  fetchAddress,
};
export { api };
