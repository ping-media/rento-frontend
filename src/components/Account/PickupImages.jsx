import PhotoView from "../ImageViwer/PhotoView";

const PickupImages = ({ data }) => {
  return (
    <>
      {data &&
        Object.entries(data[0]?.files)?.map(([key, value]) => {
          return (
            <PhotoView
              item={value}
              className="w-40 h-40 border-2 h-full"
              uniqueId={key}
              key={key}
            />
          );
        })}
    </>
  );
};

export default PickupImages;
