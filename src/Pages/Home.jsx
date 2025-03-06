import { useSelector } from "react-redux";
import heroImage from "../assets/images/banner.jpg";
import HeroSection from "../components/HeroSection/HeroSection";
import SearchRide from "../components/SearchRide/SearchRide";
import PreLoader from "../components/skeleton/PreLoader";
import Faq from "../components/Faq/Faq";

const Home = () => {
  const { stationLoading } = useSelector((state) => state.station);
  return (
    <>
      {/* show preloader until station is loading  */}
      {stationLoading && <PreLoader />}
      <HeroSection imageUrl={heroImage} />
      <SearchRide />
      <Faq />
    </>
  );
};

export default Home;
