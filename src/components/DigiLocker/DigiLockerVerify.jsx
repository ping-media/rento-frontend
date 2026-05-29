import { lazy, Suspense, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import DocumentCard from "../Document/DocumentCard";
import { useDigiLocker } from "../../hooks/useDigiLocker";

const DocumentViewer = lazy(() => import("../Document/DocumentViewer"));

const DOCUMENT_TYPES = [
  {
    key: "AADHAAR",
    label: "Aadhaar",
  },
  {
    key: "PAN",
    label: "PAN Card",
  },
  {
    key: "DRIVING_LICENSE",
    label: "Driving License",
  },
];

const STATUS_TEXT = {
  loading: "Generating DigiLocker verification link...",
  redirected: "DigiLocker opened in a new tab. Complete OTP and consent there.",
  polling: "Waiting for verification confirmation...",
  fetching: "Fetching your verified documents...",
};

const DigiLockerVerify = () => {
  const {
    currentUser: { _id: userId },
  } = useSelector((state) => state.user);

  const { status, documents, error, startVerification } = useDigiLocker(userId);

  const [activeDoc, setActiveDoc] = useState("AADHAAR");

  const activeDocument = useMemo(() => {
    return documents?.[activeDoc];
  }, [documents, activeDoc]);

  const activeDocumentData = activeDocument?.data;

  return (
    // <div className="mx-auto w-full space-y-6 px-4 py-6">
    <div className="border-2 rounded-lg px-4 py-2 shadow-md bg-white">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            DigiLocker Verification
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Securely verify and access government-issued documents.
          </p>
        </div>

        {(status === "idle" || status === "error") && (
          <button
            onClick={startVerification}
            className="rounded-xl bg-theme px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Verify Documents
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading Status */}
      {STATUS_TEXT[status] && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          {STATUS_TEXT[status]}
        </div>
      )}

      {/* Success */}
      {status === "done" && documents && (
        <>
          {/* Success Banner */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">
              Documents verified successfully
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3">
            {DOCUMENT_TYPES.map((doc) => (
              <button
                key={doc.key}
                onClick={() => setActiveDoc(doc.key)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  activeDoc === doc.key
                    ? "border-theme bg-theme text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {doc.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
            {/* Left Card */}
            <DocumentCard documentType={activeDoc} document={activeDocument} />

            {/* Right PDF Viewer */}
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Document Preview
                </h2>

                <p className="text-sm text-gray-500">
                  View your verified document securely.
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="flex h-[700px] items-center justify-center rounded-2xl border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">
                      Loading document viewer...
                    </p>
                  </div>
                }
              >
                <DocumentViewer
                  base64Pdf={activeDocumentData?.document}
                  title={activeDoc}
                />
              </Suspense>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DigiLockerVerify;
