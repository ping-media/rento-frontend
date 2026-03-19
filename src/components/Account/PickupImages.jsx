import PhotoView from "../ImageViwer/PhotoView";

const PickupImages = ({ data }) => {
  return (
    <>
      {data &&
        Object.entries(data[0]?.files)?.map(([key, value]) => {
          return (
            <PhotoView
              item={value}
              className="w-24 h-24 border shadow-sm"
              uniqueId={key}
              key={key}
            />
          );
        })}
    </>
  );
};

export default PickupImages;
