import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/authContext";
import Navbar from "./Components/Navbar";
import { Toaster } from "react-hot-toast";
import Accoutactive from "./pages/Accoutactive";
import Forgetpassword from "./pages/ForgetPassword"; 
import AccessAccountFromForgetPwd from "./pages/AcceesAcountFrogetPassword";
import Dashboard from "./pages/private/Dashboard";
import CreateAd from "./pages/private/CreateAd";
import PrivateRouter from "./pages/privateRouter";
import SellHouse from "./pages/Ads/SellHouse";
import SellLand from "./pages/Ads/SellLand";
import RentHouse from "./pages/Ads/RentHouse";
import RentLand from "./pages/Ads/RentLand";
import ViewsAd from "./pages/Ads/ViewsAd";
import Footer from "./Components/Footer";
import Profile from "./pages/private/Profile";
import AdEdit from "./pages/Ads/EditAd";
import DashboardAdCard from "./Components/DashboardCard";
import Wishlist from "./pages/Ads/WishList";
import EnquiriesClient from "./pages/Ads/EnquriesClient";
import Agents from "./pages/Agents/agents";
import Agent from "./pages/Agents/agent";
import { SearchProvider } from "./context/searchContext";
import Search from "./Components/SearchResult";

const PageNotFound = () => (
  <div className="text-center p-5">404 PAGE NOT FOUND!</div>
);


function App() {
  return (
    <div
      style={{
        // backgroundColor:'lightgrey',
        minHeight: "100vh",
      }}
    >
      <BrowserRouter>
        <Toaster />

        <AuthProvider>
          <SearchProvider>



          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/auth/account-activate/:token"
              element={<Accoutactive />}
            />
            <Route path="/auth/forget-password" element={<Forgetpassword />} />
            <Route
              path="/auth/access-account/:token"
              element={<AccessAccountFromForgetPwd />}
            />
            <Route path="/" element={<PrivateRouter />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ad/create" element={<CreateAd />} />
              <Route path="ad/create/sell/house" element={<SellHouse />} />
            <Route path="ad/create/sell/land" element={<SellLand />} />
            <Route path="ad/create/rent/house" element={<RentHouse />} />
            <Route path="ad/create/rent/land" element={<RentLand />} />
           <Route path="user/profile" element={<Profile/>}/>
           <Route path="/ad/edit/:slug" element={<AdEdit />} />
           <Route path="user/ad/:slug" element={<DashboardAdCard />} />
           <Route path="user/wishlist" element={<Wishlist />} />
              <Route path="user/enquiries" element={<EnquiriesClient />} />
            </Route>

            <Route path="/ad/:slug" element={<ViewsAd />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agent/:username" element={<Agent />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<PageNotFound />} />

          </Routes>
          {/* <Footer/> */}
          </SearchProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
