const HeroSection = ({ imageUrl }) => {
  return (
    <div className="w-full h-full lg:h-[72vh]">
      <img
        src={imageUrl}
        className="w-full h-full object-cover"
        loading="lazy"
        alt="HERO-BANNER"
      />
    </div>
  );
};

export default HeroSection;
