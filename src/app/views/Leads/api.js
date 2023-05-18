import { rest } from "../../services/rest";
const model = "ws/rest/com.axelor.apps.crm.db.Lead";

const getLeads = async (reqBody = {}) => {
  const response = await rest.post(`${model}/search`, {
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
  });

  if (response && response.data.status !== -1) {
    return response?.data;
  }
};

const deleteLeads = (records) => {
  return rest
    .post(`/${model}/removeAll`, { records })
    .then((data) => data?.data);
};
const addLead = async (data) => {
  const response = await rest.post(`/${model}`, {
    data,
  });
  if (response && response.data.status !== -1) {
    return response?.data;
  }
};
const getLead = async (id) => {
  const response = await rest.post(`/${model}/${id}/fetch`, {
    fields: [
      "statusSelect",
      "firstName",
      "emailAddress",
      "contactDate",
      "name",
      "fixedPhone",
      "enterpriseName",
      "user",
      "jobTitleFunction",
      "primaryPostalCode",
      "webSite",
      "picture",
      "primaryAddress",
      "primaryCity",
      "primaryCountry",
    ],
    related: {
      emailAddress: ["address"],
    },
  });
  if (response && response.data.status !== -1) {
    return response?.data?.data[0];
  }
};
const updateLeads = (id, data) => {
  return rest
    .post(`/${model}`, {
      id,
      data,
    })
    .then(({ data }) => data?.data);
};
const fetchJob = async () => {
  const response = await rest.post(
    "/ws/rest/com.axelor.apps.base.db.Function/search",
    {
      fields: ["id", "name", "code"],
    }
  );
  if (response && response.data.status === 0) {
    return response;
  }
};
const fetchCity = async () => {
  const response = await rest.post(
    "/ws/rest/com.axelor.apps.base.db.City/search",
    {
      fields: ["id", "fullName", "name", "zip"],
    }
  );
  if (response && response.data.status === 0) {
    return response;
  }
};
const fetchCountry = async () => {
  const response = await rest.post(
    "/ws/rest/com.axelor.apps.base.db.Country/search",
    {
      fields: ["id", "name"],
    }
  );
  if (response && response?.data?.status === 0) {
    return response;
  }
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

    if (response && response.data.status === 0) {
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
