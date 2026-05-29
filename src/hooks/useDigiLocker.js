import { useCallback, useEffect, useRef, useState } from "react";

import {
  getDocuments,
  createVerificationUrl,
  checkVerificationStatus,
  fetchVerifiedDocuments,
} from "../services/digilocker.api";

export const useDigiLocker = (userId) => {
  const [status, setStatus] = useState("idle");
  const [documents, setDocuments] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState(null);

  const pollingRef = useRef(null);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const loadExistingDocuments = useCallback(async () => {
    if (!userId) return;

    setStatus("checking");

    try {
      const data = await getDocuments(userId);

      if (data?.status === "AUTHENTICATED") {
        setDocuments(data.documents);
        setVerificationId(data.verification_id);
        setStatus("done");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  }, [userId]);

  const fetchDocuments = useCallback(
    async (vid) => {
      try {
        setStatus("fetching");

        const data = await fetchVerifiedDocuments(vid, userId);

        setDocuments(data);
        setStatus("done");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch documents");

        setStatus("error");
      }
    },
    [userId],
  );

  const startPolling = useCallback(
    (vid) => {
      stopPolling();

      setStatus("polling");

      pollingRef.current = setInterval(async () => {
        try {
          const data = await checkVerificationStatus(vid, userId);

          if (data.status === "AUTHENTICATED") {
            stopPolling();
            fetchDocuments(vid);
          }

          if (["EXPIRED", "CONSENT_DENIED"].includes(data.status)) {
            stopPolling();

            setError(
              `Verification ${data.status.toLowerCase().replace("_", " ")}`,
            );

            setStatus("error");
          }
        } catch {
          stopPolling();
          setError("Status polling failed");
          setStatus("error");
        }
      }, 5000);
    },
    [fetchDocuments, userId],
  );

  const startVerification = async () => {
    try {
      setError(null);
      setStatus("loading");

      const data = await createVerificationUrl(userId);

      setVerificationId(data.verification_id);

      window.open(data.url, "_blank");

      setStatus("redirected");

      startPolling(data.verification_id);
    } catch (err) {
      setError(err.response?.data?.message || err.message);

      setStatus("error");
    }
  };

  useEffect(() => {
    loadExistingDocuments();

    return () => stopPolling();
  }, [loadExistingDocuments]);

  return {
    status,
    documents,
    verificationId,
    error,
    startVerification,
  };
};
