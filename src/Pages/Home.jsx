import { useSelector } from "react-redux";
import heroImage from "../assets/images/banner.jpg";
import HeroSection from "../components/HeroSection/HeroSection";
import SearchRide from "../components/SearchRide/SearchRide";
import PreLoader from "../components/skeleton/PreLoader";

const Home = () => {
  const { stationLoading } = useSelector((state) => state.station);
  return (
    <>
      {/* show preloader until station is loading  */}
      {stationLoading && <PreLoader />}
      <HeroSection imageUrl={heroImage} />
      <SearchRide />
    </>
  );
};

export default Home;
