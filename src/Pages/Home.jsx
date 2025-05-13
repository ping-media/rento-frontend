import { useSelector } from "react-redux";
import ActivaImage from "../assets/images/activa.png";
import heroImage from "../assets/images/hero-banner.jpg";
import HeroSection from "../components/HeroSection/HeroSection";
import SearchRide from "../components/SearchRide/SearchRide";
import PreLoader from "../components/skeleton/PreLoader";
import Faq from "../components/Faq/Faq";
// import Slider from "../components/carousel/Slider";
import Package from "../components/ProductCard/Package";

const Home = () => {
  const { stationLoading } = useSelector((state) => state.station);
  return (
    <>
      {stationLoading && <PreLoader />}
      <HeroSection imageUrl={heroImage} secondImgeUrl={ActivaImage} />
      {/* <Slider /> */}
      <SearchRide />
      <Package />
      <Faq />
    </>
  );
};

export default Home;
