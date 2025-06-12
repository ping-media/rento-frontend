import { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const PhotoView = ({
  item,
  className = "w-full",
  hookLoading,
  uniqueId,
  errMessage = "N0 Iamges Found.",
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (item) {
      const lightbox = new PhotoSwipeLightbox({
        gallery: `#${uniqueId}`,
        children: "a",
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();
      return () => lightbox.destroy();
    }
  }, [item]);

  useEffect(() => {
    if (item?.imageUrl || item?.link) {
      const img = new Image();
      img.src = item.imageUrl || item.link;
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }, [item]);

  return (
    <div>
      {!hookLoading && item ? (
        <div id={uniqueId}>
          <div className={`relative ${className}`} key={item?._id}>
            <a
              href={item.imageUrl}
              data-pswp-width={imageSize.width}
              data-pswp-height={imageSize.height}
              target="_blank"
              rel="noreferrer"
              style={{
                aspectRatio:
                  imageSize.width && imageSize.height
                    ? `${imageSize.width} / ${imageSize.height}`
                    : "auto",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.fileName}
                className="w-full h-full object-contain brightness-95"
              />
            </a>
          </div>
        </div>
      ) : (
        <p className="italic text-sm my-2 text-gray-400">{errMessage}</p>
      )}
    </div>
  );
};

export default PhotoView;
