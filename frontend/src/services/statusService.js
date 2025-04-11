import fetchDataService from "../utils/fetchDataService";

const statusService = {
  getAll: async () => {
    return fetchDataService("/admin/status", "get", null, "statuses");
  },
  create: async (data) => {
    return fetchDataService("/admin/status", "post", data, "status");
  },
  update: async (id, data) => {
    return fetchDataService(`/admin/status/${id}`, "put", data, "status");
  },

  delete: async (id) => {
    return fetchDataService(`/admin/status/${id}`, "delete");
  },
};

export default statusService;
