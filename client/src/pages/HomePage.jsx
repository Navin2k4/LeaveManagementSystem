import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";

function HomePage() {
  const { currentUser } = useSelector((state) => state.user);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const features = [
    {
      icon: <CheckCircle size={20} />,
      text: "Submit and track leave requests easily",
    },
    { icon: <Clock size={20} />, text: "Real-time status updates" },
    { icon: <Shield size={20} />, text: "Secure and reliable system" },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Animated SVG Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full opacity-30 dark:opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient
              id="Gradient1"
              cx="50%"
              cy="50%"
              fx="0.441602%"
              fy="50%"
              r=".5"
            >
              <animate
                attributeName="fx"
                dur="34s"
                values="0%;3%;0%"
                repeatCount="indefinite"
              />
              <stop offset="0%" stopColor="rgba(66, 153, 225, 0.3)" />
              <stop offset="100%" stopColor="rgba(66, 153, 225, 0)" />
            </radialGradient>
            <radialGradient
              id="Gradient2"
              cx="50%"
              cy="50%"
              fx="2.68147%"
              fy="50%"
              r=".5"
            >
              <animate
                attributeName="fx"
                dur="23.5s"
                values="0%;3%;0%"
                repeatCount="indefinite"
              />
              <stop offset="0%" stopColor="rgba(99, 179, 237, 0.3)" />
              <stop offset="100%" stopColor="rgba(99, 179, 237, 0)" />
            </radialGradient>
            <radialGradient
              id="Gradient3"
              cx="50%"
              cy="50%"
              fx="0.836536%"
              fy="50%"
              r=".5"
            >
              <animate
                attributeName="fx"
                dur="21.5s"
                values="0%;3%;0%"
                repeatCount="indefinite"
              />
              <stop offset="0%" stopColor="rgba(144, 205, 244, 0.3)" />
              <stop offset="100%" stopColor="rgba(144, 205, 244, 0)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)">
            <animate
              attributeName="x"
              dur="20s"
              values="25%;0%;25%"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              dur="21s"
              values="0%;25%;0%"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="17s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient2)">
            <animate
              attributeName="x"
              dur="23s"
              values="-25%;0%;-25%"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              dur="24s"
              values="0%;50%;0%"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="18s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient3)">
            <animate
              attributeName="x"
              dur="25s"
              values="0%;25%;0%"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              dur="26s"
              values="0%;25%;0%"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="19s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <motion.h1
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#1f3a6e]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                VCET Connect
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 leading-relaxed"
                variants={fadeInUp}
              >
                Experience a seamless leave management system designed for
                VCET's academic community. Streamline your requests, track
                status updates, and stay connected.
              </motion.p>
            </motion.div>

            {/* Features List */}
            <motion.div className="space-y-4" variants={staggerContainer}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center space-x-3 text-gray-700"
                >
                  <span className="p-2 bg-blue-100  rounded-full text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </span>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            {currentUser && (
              <motion.div variants={fadeInUp} className="pt-4">
                <Link
                  to={
                    currentUser.userType === "Staff"
                      ? "/staffdashboard"
                      : currentUser.userType === "Student"
                      ? "/profile"
                      : "/hoddash"
                  }
                  className="group inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-[#1f3a6e] rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {currentUser.userType === "Staff" ||
                  currentUser.userType === "Student"
                    ? "Leave Request Form"
                    : "View Dashboard"}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Image and Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-[500px] object-cover transform hover:scale-110 transition-transform duration-1000"
                src="https://content3.jdmagicbox.com/comp/madurai/31/0452p452std2000631/catalogue/velammal-college-of-engineering-and-technology-munichalai-road-madurai-engineering-colleges-dxevz9.jpg"
                alt="Velammal College of Engineering and Technology"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 left-6 right-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Why Choose VCET Connect?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Experience seamless leave management with real-time updates,
                  secure processing, and instant notifications.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
