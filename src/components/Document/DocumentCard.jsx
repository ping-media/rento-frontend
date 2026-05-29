import { memo } from "react";

import { formatAddress } from "../../utils/formatAddress";

const LABELS = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  DRIVING_LICENSE: "Driving License",
};

const DetailRow = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-3">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>

      <span className="break-words text-sm font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
};

const DocumentCard = memo(({ documentType, document }) => {
  if (!document) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">No document found.</p>
      </div>
    );
  }

  if (!document.success) {
    return (
      <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
        <p className="text-sm font-medium text-orange-700">{document.error}</p>
      </div>
    );
  }

  const data = document.data;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-start gap-4">
          {/* Photo */}
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            {data?.photo ? (
              <img
                src={`data:image/jpeg;base64,${data.photo}`}
                alt="User"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No Photo
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <div className="mb-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              VERIFIED
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {data?.name || "Unknown User"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">{LABELS[documentType]}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 p-6">
        <DetailRow label="Date of Birth" value={data?.dob} />

        <DetailRow label="Gender" value={data?.gender} />

        <DetailRow label="Address" value={formatAddress(data?.address)} />

        {data?.aadhaar_number && (
          <DetailRow label="Aadhaar Number" value={data.aadhaar_number} />
        )}

        {data?.pan_number && (
          <DetailRow label="PAN Number" value={data.pan_number} />
        )}

        {data?.license_number && (
          <DetailRow label="License Number" value={data.license_number} />
        )}
      </div>
    </div>
  );
});

export default DocumentCard;
