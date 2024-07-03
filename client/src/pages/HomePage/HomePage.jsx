//homepage.jsx
import { Link } from "react-router-dom";
import "./HomePage.scss";

function HomePage() {
  return (
    <div className="homePage justify-center">
      <div className="leftContainer">
        <div className="wrapper">
            <h1 className="title">Leave Request/Approval Management</h1>
            <p className="contentpara">
            Welcome to the <b>Velammal College of Engineering and Technology</b> Leave Request System! This platform is designed to streamline the leave request and approval process for students and staff, ensuring a smooth and efficient experience. Whether you need to submit a new leave request, check the status of a previously submitted request, or review the guidelines and policies, our system provides all the necessary tools at your fingertips. With real-time status updates and easy communication channels, managing your leave has never been easier. Explore our user-friendly interface to make the most of your leave management process at Velammal College of Engineering and Technology.
            </p>
            <div className="request-btn-div">
              <Link to='/leaverequest' className="request-leave-btn">
                <button className="text-center">Leave Request Form</button>
               </Link>
            </div>
        </div>
        
      </div>
      <div className="rightContainer">
        
      </div>
    </div>
  );
}

export default HomePage;