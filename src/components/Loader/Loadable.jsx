import { Suspense } from "react";
import PreLoader from "../skeleton/PreLoader";

const Loadable = (Component) => (
  <Suspense fallback={<PreLoader showLogo />}>
    <Component />
  </Suspense>
);

export default Loadable;
