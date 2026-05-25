import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function LayoutPrincipal() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <footer className="bg-dark text-white text-center py-4 mt-5">
        <p className="mb-0">StyleMarket &copy; 2026</p>
      </footer>
    </>
  );
}

export default LayoutPrincipal;