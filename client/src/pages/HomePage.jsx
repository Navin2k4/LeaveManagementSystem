import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { TypeAnimation } from "react-type-animation";

function HomePage() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      <div className="flex-1 flex justify-center bg-gradient-to-t from-blue-500 to-[#244784] p-6 shadow-lg">
        <div className="max-w-2xl md:max-w-3xl text-left">
          <div className="flex flex-col gap-2 md:mt-10">
            <div>
              <h1 className="text-5xl font-bold tracking-wider text-white ">
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
                className="text-5xl font-bold mb-6 tracking-wider text-blue-400 transition-all duration-500"
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-6 tracking-wider text-white ">
                System
              </h1>
            </div>
          </div>
          <p className="text-lg leading-8  text-justify mb-8 text-secondary-white text-white indent-36">
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
                  className="bg-white text-black hover:bg-ternary-blue hover:text-black font-semibold rounded-full px-6 py-3 md:px-8 md:py-4 text-lg transition duration-300 shadow-black/60 shadow-sm hover:shadow-md transform  hover:scale-105"
                >
                  Leave Request Form
                </Link>
              ) : currentUser.userType === "Student" ? (
                <Link
                  to="/profile"
                  className=" bg-white text-black hover:bg-ternary-blue hover:text-black font-semibold rounded-full px-6 py-3 md:px-8 md:py-4 text-lg transition duration-300 shadow-black/60 shadow-sm hover:shadow-md transform  hover:scale-105"
                >
                  Leave Request Form
                </Link>
              ) : (
                <Link
                  to="/hoddash"
                  className=" bg-white font-semibold rounded-full p-2 text-lg transition duration-300 shadow-black shadow-md transform  hover:scale-105"
                >
                  View Dash Board
                </Link>
              )
            ) : null}
          </div>
          {!currentUser && (
            <div className="grid items-center text-center">
              <Link
                to="/signin"
                className=" bg-white font-semibold rounded-full p-2 text-lg transition duration-300 shadow-black shadow-md transform  hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          )}
           {!currentUser && (
            <div className="my-4 grid grid-cols-1 gap-4 items-center text-center">
              <Link
                to="/studentsignup"
                className=" bg-white font-semibold rounded-full p-2 text-lg transition duration-300 shadow-black shadow-md transform  hover:scale-105"
              >
                Sign Up Student
              </Link>
              <Link
                to="/staffsignup"
                className=" bg-white font-semibold rounded-full p-2 text-lg transition duration-300 shadow-black shadow-md transform  hover:scale-105"
              >
                Sign Up Staff
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 hidden lg:block  overflow-hidden">
        <img
          className="w-full h-full object-cover filter transition-all duration-1000 hover:scale-125"
          src="https://content3.jdmagicbox.com/comp/madurai/31/0452p452std2000631/catalogue/velammal-college-of-engineering-and-technology-munichalai-road-madurai-engineering-colleges-dxevz9.jpg"
          alt="Velammal College of Engineering and Technology"
        />
      </div>

      <div className="flex-1 flex justify-center bg-gradient-to-b from-blue-500 to-[#244784] items-center bg-secondary-white p-8">
        <div className="max-w-2xl md:max-w-3xl text-left">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-right text-white leading-tight">
            Why <span className="text-blue-400 text-6xl">LMS?</span>
          </h2>
          <ul className="text-lg leading-relaxed text-justify mb-8 text-white list-disc list-inside bg-white/20 bg-opacity-10 backdrop-blur-md border border-transparent rounded-lg shadow-md p-6">
            <li className="mb-4">
              <span className="text-white italic">Efficiency :</span> Our system
              simplifies the leave request and approval process, saving time and
              reducing paperwork.
            </li>
            <li className="mb-4">
              <span className="text-white italic">Real-Time Updates :</span> Get
              instant notifications on the status of your leave requests,
              ensuring you are always informed.
            </li>
            <li className="mb-4">
              <span className="text-white italic">
                User-Friendly Interface :
              </span>{" "}
              Designed with ease of use in mind, making it accessible for
              everyone.
            </li>
            <li className="mb-4">
              <span className="text-white italic">
                Comprehensive Policies :
              </span>{" "}
              Access to detailed leave policies and guidelines to ensure
              compliance and understanding.
            </li>
            <li className="mb-4">
              <span className="text-white italic">Secure :</span> Your data is
              protected with the highest standards of security and privacy.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
