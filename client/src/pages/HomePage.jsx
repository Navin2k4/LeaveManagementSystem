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

  const features = [
    {
      icon: <CheckCircle size={20} />,
      text: "Submit and track leave requests easily",
    },
    { icon: <Clock size={20} />, text: "Real-time status updates" },
    { icon: <Shield size={20} />, text: "Secure and reliable system" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
                className="text-5xl font-bold bg-clip-text text-transparent bg-blue-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                VCET Connect
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                variants={fadeInUp}
              >
                Experience a seamless leave management system designed for
                VCET's academic community. Streamline your requests, track
                status updates, and stay connected.
              </motion.p>
            </motion.div>

            <motion.div className="grid sm:grid-cols-2 gap-4 mb-8" variants={fadeInUp}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                >
                  <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </span>
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            {currentUser && (
              <motion.div variants={fadeInUp}>
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
                  {currentUser.userType === "Staff" || currentUser.userType === "Student" ? "Leave Request Form" : "View Dashboard"}
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