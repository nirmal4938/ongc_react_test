import { Outlet } from "react-router-dom";

const AuthLayOut: React.FC = () => {
  return (
    <div className="site-content2">
      <Outlet />
    </div>
  );
};

export default AuthLayOut;
