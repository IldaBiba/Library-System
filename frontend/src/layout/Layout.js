import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main> <Outlet /></main>
        <Footer/>
     </div>
    );
};
export default Layout;
