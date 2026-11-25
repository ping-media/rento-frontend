import { useEffect, useRef, useState } from "react";
import { fetchingData } from "../../Data";
import PhotoView from "../ImageViwer/PhotoView";
import PdfViewer from "../Pdf/PdfViewer";
import { openImagePreview } from "../../utils/openImagePreview";

const TYPE_LABELS = {
  rc: "Registration Certificate",
  insurance: "Insurance",
  puc: "PUC Certificate",
  fitness: "Fitness Certificate",
  service_invoice: "Service / Repair Invoice",
  others: "Document",
};

const nameOf = (doc) =>
  doc.title || TYPE_LABELS[doc.documentType] || "Document";

const VehicleDocuments = ({ bookingId, userId, rideStatus }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewReady, setPreviewReady] = useState(false);
  const viewLock = useRef(false);

  const isOngoing = rideStatus === "ongoing";

  useEffect(() => {
    if (!isOngoing || !bookingId || !userId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetchingData(
          `/bookings/${bookingId}/vehicle-documents?userId=${userId}`,
        );
        setDocs(res?.success ? res.data || [] : []);
      } catch (e) {
        setDocs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId, userId, isOngoing]);

  const handleView = async (doc) => {
    if (viewLock.current) return;
    viewLock.current = true;
    setOpeningId(doc._id);

    try {
      if (doc.mimeType === "application/pdf") {
        setPreviewReady(false);
        setPreview({
          url: `${import.meta.env.VITE_BACKEND_URL}/bookings/${bookingId}/vehicle-documents/${doc._id}/file?userId=${userId}`,
          isPdf: true,
          name: nameOf(doc),
        });
        return;
      }

      const res = await fetchingData(
        `/bookings/${bookingId}/vehicle-documents/${doc._id}/link?userId=${userId}`,
      );
      if (!res?.success || !res.data?.url) return;
      await openImagePreview(res.data.url);
    } catch (e) {
      // access may have ended (ride completed), hide the list
      setDocs([]);
    } finally {
      viewLock.current = false;
      setOpeningId("");
    }
  };

  const closePreview = () => {
    setPreview(null);
    setPreviewReady(false);
  };

  // nothing to show: not ongoing, or no documents for customers
  if (!isOngoing) return null;
  if (!loading && docs.length === 0) return null;

  return (
    <div className="mb-5">
      <h2 className="font-semibold mb-3 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        Vehicle Documents
      </h2>

      <div className="rounded-lg border-2 p-2 lg:px-4">
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-md bg-gray-200"
              />
            ))}
          </div>
        ) : (
          docs.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-b-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-8 w-8 shrink-0 text-red-500"
                fill="currentColor"
              >
                <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5z" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-gray-800">
                  {nameOf(doc)}
                </p>
                <p className="text-xs text-gray-500">
                  {doc.mimeType === "application/pdf"
                    ? "PDF document"
                    : "Image"}
                </p>
              </div>
              <button
                type="button"
                disabled={!!openingId}
                onClick={() => handleView(doc)}
                className="flex min-w-[4.5rem] items-center justify-center rounded-md border border-theme px-4 py-2 text-sm font-semibold text-theme hover:bg-theme hover:text-white disabled:opacity-50"
              >
                {openingId === doc._id ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-theme border-t-transparent" />
                ) : (
                  "View"
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900 bg-opacity-60 sm:items-center sm:px-4"
          onMouseDown={(e) => e.target === e.currentTarget && closePreview()}
        >
          <div className="w-full max-w-2xl rounded-t-2xl bg-white shadow-xl sm:rounded-md">
            <div className="flex items-center justify-between border-b p-3">
              <h3 className="truncate pr-2 text-base font-semibold text-gray-800">
                {preview.name}
              </h3>
              <button
                type="button"
                onClick={closePreview}
                aria-label="Close"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* fixed height so nothing shifts while loading */}
            <div
              className="relative h-[70vh] overflow-y-auto p-3"
              onContextMenu={(e) => e.preventDefault()}
            >
              {!previewReady && (
                <div className="absolute inset-3 z-10 animate-pulse rounded-md bg-gray-200" />
              )}
              {preview.isPdf ? (
                <PdfViewer
                  url={preview.url}
                  onReady={() => setPreviewReady(true)}
                />
              ) : (
                previewReady && (
                  <PhotoView
                    item={{ imageUrl: preview.url, fileName: preview.name }}
                    uniqueId="customer-vehicle-doc-preview"
                    className="w-full"
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDocuments;
