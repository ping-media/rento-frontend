import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export const getDocuments = async (userId) => {
  const { data } = await axios.get(`${API}/digilocker/my-documents`, {
    params: { userId },
  });

  return data;
};

export const createVerificationUrl = async (userId) => {
  const { data } = await axios.post(`${API}/digilocker/create-url`, {
    userId,
  });

  return data;
};

export const checkVerificationStatus = async (verification_id, userId) => {
  const { data } = await axios.get(`${API}/digilocker/status`, {
    params: {
      verification_id,
      userId,
    },
  });

  return data;
};

export const fetchVerifiedDocuments = async (verification_id, userId) => {
  const { data } = await axios.post(`${API}/digilocker/fetch-documents`, {
    verification_id,
    userId,
  });

  return data;
};
