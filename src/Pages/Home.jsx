import { useSelector } from "react-redux";
import ActivaImage from "../assets/images/activa.png";
import heroImage from "../assets/images/hero-banner.jpg";
import HeroSection from "../components/HeroSection/HeroSection";
import SearchRide from "../components/SearchRide/SearchRide";
import PreLoader from "../components/skeleton/PreLoader";
import Faq from "../components/Faq/Faq";
import Slider from "../components/carousel/Slider";
import Package from "../components/ProductCard/Package";
import Testimonials from "../components/ProductCard/Testimonials";

const Home = () => {
  const { stationLoading } = useSelector((state) => state.station);
  const { slides } = useSelector((state) => state.general);

  return (
    <>
      {stationLoading && <PreLoader />}
      {slides?.length === 0 ? (
        <HeroSection imageUrl={heroImage} secondImgeUrl={ActivaImage} />
      ) : (
        <Slider slides={slides} />
      )}
      <SearchRide />
      <Package />
      <Testimonials />
      <Faq />
    </>
  );
};

export default Home;
