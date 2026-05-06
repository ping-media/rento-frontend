export const getPlatform = () => {
  const ua = navigator.userAgent || navigator.vendor;

  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  return "web";
};
