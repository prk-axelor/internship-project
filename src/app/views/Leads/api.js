import { rest } from "../../services/rest";
const model = "ws/rest/com.axelor.apps.crm.db.Lead";

const getLeads = (reqBody = {}) => {
  return rest
    .post(`${model}/search`, {
      fields: [
        "statusSelect",
        "firstName",
        "emailAddress.address",
        "contactDate",
        "name",
        "fixedPhone",
        "updatedOn",
        "createdOn",
        "enterpriseName",
        "user",
        "jobTitleFunction",
        "primaryPostalCode",
      ],
      ...reqBody,
    })
    .then(({ data }) => data);
};

const deleteLeads = (records) => {
  return rest
    .post(`/${model}/removeAll`, { records })
    .then((data) => data?.data);
};
const addLead = (data) => {
  return rest
    .post(`/${model}`, {
      data,
    })
    .then((data) => data?.data);
};
const getLead = (id) => {
  return rest
    .post(`/${model}/${id}/fetch`, {})
    .then(({ data }) => data?.data[0]);
};
const updateLeads = (id, data) => {
  return rest
    .post(`/${model}`, {
      id,
      data,
    })
    .then(({ data }) => data?.data);
};
const fetchJob = () => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Function/search", {
    fields: ["id", "name", "code"],
  });
};
const fetchCity = () => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.City/search", {
    fields: ["id", "fullName", "name", "zip"],
  });
};
const fetchCountry = () => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Country/search", {
    fields: ["id", "name"],
  });
};

const fecthAction = async (id, fullName) => {
  try {
    const response = await rest.post(`/ws/action`, {
      model: "com.axelor.apps.crm.db.Lead",
      action: "action-attrs-lead-set-primary-state-country-postal-code",
      data: {
        context: {
          primaryCity: {
            id: id,
            fullName: fullName,
          },
        },
      },
    });

    if (response && response.data.status !== -1) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const api = {
  getLeads,
  getLead,
  deleteLeads,
  addLead,
  updateLeads,
  fetchJob,
  fetchCity,
  fecthAction,
  fetchCountry,
};
export { api };
