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
        "mobilePhone",
        "emailAddress",
        "partnerCategory.name",
        "fiscalPosition.code",
        "registrationCode",
        "companyStr",
        "registrationCode",
        "saleTurnover",
        "nbrEmployees",
        "webSite",
        "partnerCategory",
        "source",
        "user",
        "team",
        "language",
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
const fetchSource = (value) => {
  return rest.post("/ws/rest/com.axelor.apps.base.db.Source/search", {
    data: { name: value },
    fields: ["id", "name", "code"],
  });
};
const fetchAssign = async (value) => {
  const res = await rest.post("/ws/rest/com.axelor.auth.db.User/search", {
    data: {
      fullName: value,
    },

    fields: ["id", "fullName", "partner", "name", "code"],
  });

  return res || [];
};
const fetchTeam = async (value) => {
  const res = await rest.post("/ws/rest/com.axelor.team.db.Team/search", {
    data: {
      name: value,
    },
    fields: ["id", "name", "code"],
  });
  return res || [];
};
const fetchLanguage = async (value) => {
  const res = await rest.post(
    "/ws/rest/com.axelor.apps.base.db.Language/search",
    {
      data: {
        name: value,
      },
      fields: ["id", "name", "code"],
    }
  );
  return res || [];
};
const imageUploader = async (file) => {
  console.log("file:", file);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("field", undefined);
  formData.append(
    "request",
    JSON.stringify({
      data: {
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size,
        id: file?.id,
        version: file?.version,
        $upload: { file: {} },
      },
    })
  );

  const res = await rest.post(
    "/ws/rest/com.axelor.meta.db.MetaFile/upload",
    formData,
    {
      headers: {
        "Content-Type": 'multipart/form-data;  boundary="another cool boundary',
      },
    }
  );
  console.log({ res });
  return res;
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
  imageUploader,
};

export { api };
