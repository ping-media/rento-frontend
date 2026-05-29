import { memo } from "react";

const DocumentViewer = memo(({ base64Pdf, title }) => {
  if (!base64Pdf) {
    return <p className="text-sm text-gray-500">PDF not available</p>;
  }

  return (
    <iframe
      src={`data:application/pdf;base64,${base64Pdf}`}
      title={title}
      className="h-[700px] w-full rounded-xl border"
      loading="lazy"
    />
  );
});

export default DocumentViewer;
