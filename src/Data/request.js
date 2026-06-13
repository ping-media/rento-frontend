import axios from "axios";

export const request = async ({
  endpoint,
  method = "get",
  data,
  headers = { "Content-Type": "application/json" },
  retries = 5,
  delay = 500,
  on404,
}) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios({
        url: `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        method,
        data,
        headers,
      });

      return response?.data;
    } catch (error) {
      const status = error?.response?.status;

      // Don't retry for 404
      if (status === 404) {
        on404?.();
        throw error;
      }

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
};
