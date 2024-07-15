import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { TypeAnimation } from "react-type-animation";

function HomePage() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      <div className="flex-1 flex justify-center bg-ternary-blue p-6 shadow-lg">
        <div className="max-w-2xl md:max-w-3xl text-left">
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-5xl font-bold tracking-wider text-primary-blue ">
                Leave
              </h1>
            </div>
            <div>
              <TypeAnimation
                sequence={[
                  "Management",
                  1500,
                  "Request",
                  1500,
                  "Approval",
                  1500,
                ]}
                cursor={true}
                repeat={Infinity}
                className="text-5xl font-bold mb-6 tracking-wider text-black transition-all duration-500"
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-6 tracking-wider text-primary-blue ">
                System
              </h1>
            </div>
          </div>
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
                  className="bg-gradient-to-r from-primary-blue via-secondary-blue to-ternary-blue  hover:bg-primary-blue text-black font-semibold rounded-full px-6 py-3 md:px-8 md:py-4 text-lg transition duration-300 shadow-black/60 shadow-sm hover:shadow-md transform  hover:scale-105"
                >
                  Leave Request Form
                </Link>
              ) : currentUser.userType === "Student" ? (
                <Link
                  to="/profile"
                  className="bg-gradient-to-r from-primary-blue via-secondary-blue to-ternary-blue  hover:bg-primary-blue text-black font-semibold rounded-full px-6 py-3 md:px-8 md:py-4 text-lg transition duration-300 shadow-black/60 shadow-sm hover:shadow-md transform  hover:scale-105"
                >
                  Leave Request Form
                </Link>
              ) : (
                <Link
                  to="/hoddash"
                  className="bg-gradient-to-r from-primary-blue via-secondary-blue to-ternary-blue  hover:bg-primary-blue text-black font-semibold rounded-full px-6 py-3 md:px-8 md:py-4 text-lg transition duration-300 shadow-black/60 shadow-sm hover:shadow-md  transform  hover:scale-105"
                >
                  View Dash Board
                </Link>
              )
            ) : null}
          </div>
          <div className="flex gap-4 mt-4 justify-between items-center">
            <Link to="/staffsignup">
              <button className="cursor-pointer bg-gradient-to-r from-primary-blue via-secondary-blue to-ternary-blue hover:bg-secondary-blue text-black font-semibold rounded-full px-6 py-3 md:px-5 md:py-2 text-lg transition duration-300 shadow-black/60 shadow-sm hover:shadow-md transform hover:scale-105">
                Staff SignUp
              </button>
            </Link>
            <Link to="/studentsignup">
              <button className="cursor-pointer bg-gradient-to-r from-primary-blue via-secondary-blue to-ternary-blue hover:bg-secondary-blue text-black font-semibold rounded-full px-6 py-3 md:px-5 md:py-2 text-lg transition duration-300 shadow-black/60 shadow-sm hover:shadow-md transform hover:scale-105">
                Student SignUp
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 hidden lg:block  overflow-hidden">
        <img
          className="w-full h-full object-cover filter transition-all duration-1000 hover:scale-125"
          src="https://content3.jdmagicbox.com/comp/madurai/31/0452p452std2000631/catalogue/velammal-college-of-engineering-and-technology-munichalai-road-madurai-engineering-colleges-dxevz9.jpg"
          alt="Velammal College of Engineering and Technology"
        />
      </div>

      <div className="flex-1 flex justify-center bg-ternary-blue items-center bg-secondary-white p-8">
        <div className="max-w-2xl md:max-w-3xl text-left">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-right text-primary-blue leading-tight">
            Why <span className="text-black text-6xl">LMS?</span>
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
            Experiencing a hassle-free leave management system. Our goal is to
            make the process as smooth and efficient as possible for everyone
            involved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
