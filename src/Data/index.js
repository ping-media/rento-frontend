import axios from "axios";
import { request } from "./request";

// const fetchingData = async (endpoint, retries = 5, delay = 500) => {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
//       );
//       return response?.data;
//     } catch (error) {
//       if (attempt < retries) {
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       } else {
//         console.error("All retry attempts failed.");
//         const navigate = useNavigate();
//         navigate("*");
//         throw error;
//       }
//     }
//   }
// };
const fetchingData = (endpoint) => {
  return request({
    endpoint,
    method: "get",
    // on404: () => navigate("*"),
  });
};

// const createBooking = async (data) => {
//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/createBooking`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     return {
//       message: `Something went wrong while renting vehicle`,
//       type: "error",
//     };
//   }
// };

const createBooking = async (data) => {
  try {
    return await request({
      endpoint: "/createBooking",
      method: "post",
      data,
    });
  } catch {
    return {
      message: "Something went wrong while renting vehicle",
      type: "error",
    };
  }
};

// const handleUser = async (endpoint, data) => {
//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     return response?.data || response;
//   } catch (error) {
//     return {
//       message: "user not found.",
//       type: "error",
//     };
//   }
// };

const handleUser = async (endpoint, data) => {
  try {
    return await request({
      endpoint,
      method: "post",
      data,
    });
  } catch {
    return {
      message: "user not found.",
      type: "error",
    };
  }
};

// const handlePostData = async (endpoint, data) => {
//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     return response?.data || response;
//   } catch (error) {
//     return {
//       message: error?.message,
//       type: "error",
//     };
//   }
// };

const handlePostData = async (endpoint, data) => {
  try {
    return await request({
      endpoint,
      method: "post",
      data,
    });
  } catch (error) {
    return {
      message: error?.message,
      type: "error",
    };
  }
};

// const handlebooking = async (data, bookingId = "") => {
//   try {
//     const id = bookingId ? `?_id=${bookingId}` : "";
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/createBooking${id}`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     return {
//       message: error?.message,
//       type: "error",
//     };
//   }
// };

const handlebooking = async (data, bookingId = "") => {
  try {
    const id = bookingId ? `?_id=${bookingId}` : "";

    return await request({
      endpoint: `/createBooking${id}`,
      method: "post",
      data,
    });
  } catch (error) {
    return {
      message: error?.message,
      type: "error",
    };
  }
};

// const handleupdateUser = async (data) => {
//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/signup`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     return {
//       message: "something went wrong while updating user",
//       type: "error",
//     };
//   }
// };

const handleupdateUser = async (data) => {
  try {
    return await request({
      endpoint: "/signup",
      method: "post",
      data,
    });
  } catch {
    return {
      message: "something went wrong while updating user",
      type: "error",
    };
  }
};

// const handleuploadDocument = async (data) => {
//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/uploadDocument`,
//       data,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     return {
//       message: error?.message,
//       type: "error",
//     };
//   }
// };

const handleuploadDocument = async (data) => {
  try {
    return await request({
      endpoint: "/uploadDocument",
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    return {
      message: error?.message,
      type: "error",
    };
  }
};

const sendConfirmBookingToNumber = (data) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/sendBookingDetailesTosocial`,
    data,
  );
};

const sendEmailForBookingDetails = (data) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/sendEmailForBookingDetails`,
    data,
  );
};

const updateCouponCount = (id) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/updateCouponCount?_id=${id}`,
    { _id: id },
  );
};

// const getCouponData = async (couponCode, totalprice, isExtra) => {
//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/applyCoupon`,
//       {
//         couponName: couponCode,
//         totalAmount: totalprice,
//         isExtra: isExtra,
//       },
//     );
//     return response?.data;
//   } catch (error) {
//     return {
//       message: error?.message,
//       type: "error",
//     };
//   }
// };

const getCouponData = async (couponCode, totalprice, isExtra) => {
  try {
    return await request({
      endpoint: "/applyCoupon",
      method: "post",
      data: {
        couponName: couponCode,
        totalAmount: totalprice,
        isExtra,
      },
    });
  } catch (error) {
    return {
      message: error?.message,
      type: "error",
    };
  }
};

export {
  fetchingData,
  createBooking,
  handleUser,
  handlebooking,
  handleupdateUser,
  handleuploadDocument,
  handlePostData,
  sendConfirmBookingToNumber,
  getCouponData,
  updateCouponCount,
  sendEmailForBookingDetails,
};
