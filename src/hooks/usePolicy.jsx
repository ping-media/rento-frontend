import React, { useEffect, useState } from "react";
import { handleAsyncError } from "../utils/handleAsyncError";
import { useDispatch } from "react-redux";
import { fetchingData } from "../Data";

const policyCache = {};

const usePolicy = (id) => {
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchPolicy = async () => {
    if (!id) {
      handleAsyncError(dispatch, "Not able to find policy id!");
      return null;
    }

    // CACHE HIT
    if (policyCache[id]) {
      setPolicy(policyCache[id]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetchingData(`/all-policy/${id}`);

      if (!res) {
        handleAsyncError(
          dispatch,
          "Not able to fetch policy content! try again.",
        );
        return null;
      }

      policyCache[id] = res.content;

      setPolicy(res.content);
    } catch (error) {
      handleAsyncError(dispatch, "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [id]);

  return { policy, loading };
};

export default usePolicy;
