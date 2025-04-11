import fetchDataService from "../utils/fetchDataService";

const roleService = {
  getAll: async () => {
    return fetchDataService("/admin/roles", "get", null, "roles");
  },

  create: async (data) => {
    return fetchDataService("/admin/roles", "post", data, "role");
  },

  update: async (id, data) => {
    return fetchDataService(`/admin/roles/${id}`, "put", data, "role");
  },

  delete: async (id) => {
    return fetchDataService(`/admin/roles/${id}`, "delete");
  },
};

export default roleService;
