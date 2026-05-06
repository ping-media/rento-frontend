import { contactUsFooterLink } from "../Data/dummyData";
import { memo, useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";

export const useFooter = () => {
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

  return { loading, footerData, footerQuickLink };
};
