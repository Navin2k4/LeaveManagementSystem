import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function HomePage() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      <div className="flex-1 flex justify-center bg-ternary-blue p-6 shadow-lg">
  <div className="max-w-xl text-left">
    <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-wider text-primary-blue mt-8">
      Leave <br /> <span className="text-4xl lg:text-5xl">Request & Approval </span>Management System
    </h1>
    <p className="text-lg leading-8 font-medium text-justify mb-8 text-secondary-white indent-36">
      Manage your leave requests efficiently with our streamlined system
      designed for both students and staff. Whether you're submitting a
      new request, checking the status of previous requests, or exploring
      our policies, our platform ensures a smooth and transparent process.
      Experience real-time updates and seamless communication, tailored to
      enhance your leave management at Velammal College of Engineering and
      Technology.
    </p>
    <div className="grid items-center text-center">
      {currentUser ? (
        currentUser.userType === "Staff" ? (
          <Link
            to="/staffdashboard"
            className="bg-gradient-to-r from-primary-blue  via-secondary-blue/85 to-primary-blue  hover:bg-primary-blue text-white rounded-full py-2 px-6 text-lg transition duration-300 shadow-lg transform  hover:scale-105"
          >
            Leave Request Form
          </Link>
        ) : (
          <Link
            to="/profile"
            className="bg-gradient-to-r from-primary-blue  via-secondary-blue/85 to-primary-blue  hover:bg-primary-blue text-white rounded-full py-2 px-6 text-lg transition duration-300 shadow-lg transform  hover:scale-105"
          >
            Leave Request Form
          </Link>
        )
      ) : null}
    </div>
          <div className="flex gap-2 mt-2 md:mt-4 justify-end items-center">
            <Link to='/staffsignup'>
            <button className="cursor-pointer text-center bg-gradient-to-r from-primary-blue  via-secondary-blue/85 to-primary-blue  hover:bg-primary-blue text-white rounded-full text-md px-2 py-2 md:px-3 md:py-4 md:text-lg transition duration-300 shadow-lg  hover:scale-105">
              
              Sign Up as Staff
              </button>
            
            </Link>
            <Link  to='/studentsignup' >
              <button className="cursor-pointer text-center bg-gradient-to-r from-primary-blue  via-secondary-blue/85 to-primary-blue  hover:bg-primary-blue text-white rounded-full text-md px-2 py-2 md:px-3 md:py-4 md:text-lg transition duration-300 shadow-lg  hover:scale-105">
              Sign Up as Student
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="flex-1 hidden md:block rounded-lg overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src="https://content3.jdmagicbox.com/comp/madurai/31/0452p452std2000631/catalogue/velammal-college-of-engineering-and-technology-munichalai-road-madurai-engineering-colleges-dxevz9.jpg"
          alt="Velammal College of Engineering and Technology"
        />
      </div> */}
      <div className="flex-1 flex justify-center bg-cream items-center bg-secondary-white p-8">
        <div className="max-w-xl text-left">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-primary-blue leading-tight">
            Why Choose Our System?
          </h2>
          <ul className="text-lg leading-relaxed font-medium text-justify mb-8 text-secondary-blue list-disc list-inside">
            <li className="mb-4">
              <strong>Efficiency:</strong> Our system simplifies the leave
              request and approval process, saving time and reducing paperwork.
            </li>
            <li className="mb-4">
              <strong>Real-Time Updates:</strong> Get instant notifications on
              the status of your leave requests, ensuring you are always
              informed.
            </li>
            <li className="mb-4">
              <strong>Transparency:</strong> Clear and consistent communication
              between students, staff, and administration.
            </li>
            <li className="mb-4">
              <strong>User-Friendly Interface:</strong> Designed with ease of
              use in mind, making it accessible for everyone.
            </li>
            <li className="mb-4">
              <strong>Comprehensive Policies:</strong> Access to detailed leave
              policies and guidelines to ensure compliance and understanding.
            </li>
            <li className="mb-4">
              <strong>Secure:</strong> Your data is protected with the highest
              standards of security and privacy.
            </li>
          </ul>
          <p className="text-lg leading-relaxed font-medium text-justify text-secondary-blue">
            Join the Velammal College of Engineering and Technology community in
            experiencing a hassle-free leave management system. Our goal is to
            make the process as smooth and efficient as possible for everyone
            involved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
