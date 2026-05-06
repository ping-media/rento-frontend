import { memo } from "react";
import BrandSection from "./_components/BrandSection";
import QuickLinks from "./_components/QuickLinks";
import ContactLinks from "./_components/ContactLinks";
import AppDownload from "./_components/AppDownload";
import Copyright from "./_components/Copyright";
import { useFooter } from "../../hooks/useFooter";

const Footer = () => {
  const { loading, footerData, footerQuickLink } = useFooter();

  if (loading) return null;

  return (
    <footer className="bg-theme-black crusor-default">
      <div className="w-[95%] lg:w-[90%] mx-auto pt-6 pb-3.5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-3">
          <BrandSection socialmedia={footerData.socialmedia} />
          <QuickLinks />
          <ContactLinks links={footerQuickLink} />
          <AppDownload link={footerData.appLink} />
        </div>

        <Copyright />
      </div>
    </footer>
  );
};

export default memo(Footer);
