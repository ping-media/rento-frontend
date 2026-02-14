import { lazy, Suspense } from "react";
import { shallowEqual, useSelector } from "react-redux";
import HeroSection from "../components/HeroSection/HeroSection";
import SearchRide from "../components/SearchRide/SearchRide";
import Slider from "../components/carousel/Slider";
import Faq from "../components/Faq/Faq";
const Package = lazy(() => import("../components/ProductCard/Package"));
const Testimonials = lazy(
  () => import("../components/ProductCard/Testimonials"),
);
import PackageSkeleton from "../components/skeleton/PackageSkeleton";

const Home = () => {
  const { slides } = useSelector((state) => state.general, shallowEqual);

  const isSlides = slides?.length > 0;

  return (
    <>
      {!isSlides ? <HeroSection /> : <Slider slides={slides} />}
      <SearchRide />

      <Suspense fallback={<PackageSkeleton />}>
        <Package />
      </Suspense>

      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
      <Faq />
    </>
  );
};

export default Home;
