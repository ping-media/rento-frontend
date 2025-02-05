const PickupImages = ({ data }) => {
  // console.log(data[0]?.files);
  return (
    <>
      {data &&
        Object.entries(data[0]?.files)?.map(([key, value]) => {
          return (
            <div className="w-40 h-20 border-2 h-full" key={key}>
              <img
                src={value?.imageUrl}
                className="w-full h-full object-contain"
                alt={value?.fileName}
              />
            </div>
          );
        })}
    </>
  );
};

export default PickupImages;
