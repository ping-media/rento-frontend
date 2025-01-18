const PickupImages = ({ data }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {data &&
        Object.entries(data[0]?.files)?.map(([value]) => (
          <div className="w-48 border-2 h-full" key={value?._id}>
            <img
              src={value?.imageUrl}
              className="w-full h-full object-cover"
              alt={value?.fileName}
            />
          </div>
        ))}
    </div>
  );
};

export default PickupImages;
