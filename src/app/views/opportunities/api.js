import { rest } from "../../services/rest";
const model = "ws/rest/com.axelor.apps.crm.db.Opportunity";

const getOpportunites = (reqbody = {}) => {
  return rest
    .post(`/${model}/search`, {
      fields: [
        "tradingName",
        "amount",
        "partner",
        "opportunityLead",
        "probability",
        "opportunitySeq",
        "name",
        "salesStageSelect",
        "company",
        "createdOn",
        "user",
        "expectedCloseDate",
        "currency",
      ],
      ...reqbody,
    })
    .then((data) => data?.data);
};
const addOpportunites = (data) => {
  return rest.post(`/${model}`, { data }).then((data) => data?.data);
};
const getOpportunity = (id) => {
  return rest
    .post(`/${model}/${id}/fetch`, {})
    .then(({ data }) => data?.data[0]);
};
const updateOpportunity = (id, data) => {
  return rest.post(`/${model}`, { id, data }).then(({ data }) => data?.data);
};
const searchOpportunity = (data) => {
  return getOpportunites({
    fields: ["id", "amount", "name", "probability"],
    ...data,
  });
};
const deleteOppertunity = (records) => {
  return rest
    .post(`/${model}/removeAll`, { records })
    .then((data) => data?.data);
};
const fetchCurrency = () => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Currency/search", {
    fields: ["id", "name", "code"],
  });
};
const fetchSource = () => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Source/search", {
    fields: ["id", "name", "code"],
  });
};
const fetchOppertunityType = () => {
  return rest.post("/ws/rest/com.axelor.apps.crm.db.OpportunityType/search", {
    fields: ["id", "name", "code"],
  });
};

const api = {
  getOpportunites,
  addOpportunites,
  getOpportunity,
  updateOpportunity,
  searchOpportunity,
  deleteOppertunity,
  fetchCurrency,
  fetchSource,
  fetchOppertunityType,
};

export { api };
