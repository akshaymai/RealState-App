import { useState, useEffect } from "react";  
import axios from "axios";
// import AdCard from "../../components/cards/AdCard";
import Sidebar from "../../Components/Sidebar";
import { useAuth } from "../../context/authContext";
import Card from "../../Components/Card";

export default function EnquiriesClient() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [auth.token !== ""]);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get(`/enquiries`);
      setAds(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Enquiries</h1>
      <Sidebar />

      {!ads?.length ? (
        <div
          className="d-flex justify-content-center align-items-center vh-100"
          style={{ marginTop: "-10%" }}
        >
          <h2>
            Hey {auth.user?.name ? auth.user?.name : auth.user?.username}, You
            have not enquired any properties yet!
          </h2>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
              <p className="text-center">
                You have enquiried {ads?.length} properties
              </p>
            </div>
          </div>

          <div className="row">
            {ads?.map((ad) => (
              <Card Ad={ad} key={ad._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}