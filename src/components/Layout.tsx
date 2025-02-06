import Header from "./Header";
import { LayoutProps } from "../types/LayoutProps";

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh", padding: "1rem" }}>{children}</main>
    </div>
  );
};

export default Layout;
