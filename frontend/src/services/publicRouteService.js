import fetchDataService from "../utils/fetchDataService";

const publicRouteService = {
  //get all the roles
  getAllRoles: async () => {
    return fetchDataService("/roles", "get", null, "roles");
  },

  //get all the bank types
  getAllBankTypes: async () => {
    return fetchDataService("bank-types", "get", null, "bankTypes");
  },
  //public route for request membership
  store: async (payload) => {
    return fetchDataService("/membership-request", "post", payload);
  },
};

export default publicRouteService;
