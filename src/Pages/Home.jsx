import { useSelector } from "react-redux";
import heroImage from "../assets/images/banner.jpg";
import HeroSection from "../components/HeroSection/HeroSection";
import SearchRide from "../components/SearchRide/SearchRide";

const Home = () => {
  const { loading } = useSelector((state) => state.station);
  return (
    <>
      <HeroSection imageUrl={heroImage} />
      <SearchRide />
    </>
  );
};

export default Home;
