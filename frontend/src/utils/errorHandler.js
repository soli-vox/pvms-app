import notify from "./notify";

const errorHandler = (error) => {
  if (error.response) {
    // Server responded with a status other than 200 range
    return {
      success: false,
      message: error.response.data.message || "Server error occurred",
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  } else {
    // Something happened in setting up the request
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export default errorHandler;
