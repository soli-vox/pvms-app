import fetchDataService from "../utils/fetchDataService";

const membershipService = {
  getAll: async () => {
    return fetchDataService(
      "/admin/membership-requests",
      "get",
      null,
      "members"
    );
  },

  updateStatusWithMessage: async (userId, data) => {
    return fetchDataService(
      `/admin/membership-request/${userId}/status`,
      "put",
      data,
      "member"
    );
  },
};

export default membershipService;
