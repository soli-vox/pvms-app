import fetchDataService from "../utils/fetchDataService";

const bankTypeService = {
  getAll: async () => {
    return fetchDataService("/admin/bank-types", "get", null, "bankTypes");
  },

  create: async (data) => {
    return fetchDataService("/admin/bank-types", "post", data, "bankType");
  },
  update: async (id, data) => {
    return fetchDataService(`/admin/bank-types/${id}`, "put", data, "bankType");
  },

  delete: async (id) => {
    return fetchDataService(`/admin/bank-types/${id}`, "delete");
  },
};

export default bankTypeService;
