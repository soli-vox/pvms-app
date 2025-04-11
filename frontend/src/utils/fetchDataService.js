import apiService from "../services/apiService";
import errorHandler from "./errorHandler";
import notify from "./notify";

const fetchDataService = async (
  endpoint,
  method = "get",
  payload = null,
  resourceKey
) => {
  console.log("fetchDataService invoked:", { endpoint, method, resourceKey });
  try {
    const response = await apiService[method.toLowerCase()](endpoint, payload);
    console.log(`${method} ${endpoint} response:`, response);
    const { status: responseStatus, message, data } = response.data;
    if (responseStatus === "success") {
      const resourceData = resourceKey ? data[resourceKey] : data;
      console.log(
        `${method} ${endpoint} ${resourceKey || "data"}:`,
        resourceData
      );
      return { success: true, data: resourceData, message };
    } else {
      notify.error(message);
      return { success: false, message };
    }
  } catch (error) {
    console.error(`${method} ${endpoint} error:`, error);
    return errorHandler(error);
  }
};

export default fetchDataService;
