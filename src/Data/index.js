import axios from "axios";

const fetchingData = async (endpoint) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}${endpoint}`
    );
    // console.log(response?.data);
    return response?.data;
  } catch (error) {
    return {
      message: `no data found.`,
      type: "error",
    };
  }
};

const createBooking = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/createBooking`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      message: `Something went wrong while renting vehicle`,
      type: "error",
    };
  }
};

const handleUser = async (endpoint, data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response);
    return response?.data || response;
  } catch (error) {
    return {
      message: "user not found.",
      type: "error",
    };
  }
};

const handlePostData = async (endpoint, data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response);
    return response?.data || response;
  } catch (error) {
    return {
      message: error?.message,
      type: "error",
    };
  }
};

const handlebooking = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/createBooking`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      message: "something went wrong while siginning in or user verification",
      type: "error",
    };
  }
};

const handleupdateUser = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/signup`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      message: "something went wrong while updating user",
      type: "error",
    };
  }
};

const handleuploadDocument = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/uploadDocument`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
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
    data
  );
};

const sendEmailForBookingDetails = (data) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/sendEmailForBookingDetails`,
    data
  );
};

const updateCouponCount = (id) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/updateCouponCount?_id=${id}`,
    { _id: id }
  );
};

const getCouponData = async (couponCode, totalprice) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/applyCoupon`,
      {
        couponName: couponCode,
        totalAmount: totalprice,
      }
    );
    return response?.data;
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
