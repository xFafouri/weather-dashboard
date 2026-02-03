import { Navigate } from "react-router-dom";
import { isMobile, isTablet } from "react-device-detect";

export default function DesktopOnlyRoute({ children }) {
  if (isMobile || isTablet) {
    return <Navigate to="/unsupported-device" replace />;
  }

  return children;
}