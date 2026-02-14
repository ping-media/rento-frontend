import { contactUsFooterLink } from "../../Data/dummyData";
import { memo, useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import BrandSection from "./_components/BrandSection";
import QuickLinks from "./_components/QuickLinks";
import ContactLinks from "./_components/ContactLinks";
import AppDownload from "./_components/AppDownload";
import Copyright from "./_components/Copyright";

const Footer = () => {
  const { info, loading } = useSelector(
    (state) => ({
      info: state.general.info,
      loading: state.general.loading,
    }),
    shallowEqual,
  );

  const footerData = useMemo(() => {
    return {
      contact: info?.contact || "8884488891",
      email: info?.email || "support@rentobikes.com",
      address: info?.address || "HSR Layout, Bangalore, 560016",
      socialmedia: info?.socialmedia || {},
      appLink: { android: info?.appLink?.Android, ios: info?.appLink?.IOS },
    };
  }, [info]);

  const footerQuickLink = useMemo(
    () =>
      contactUsFooterLink({
        contact: footerData.contact,
        email: footerData.email,
        address: footerData.address,
      }),
    [footerData],
  );

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
