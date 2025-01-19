import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Calendar,
  Award,
  UserCheck,
  ClipboardCheck,
  Bell,
  BarChart,
  ArrowDown,
} from "lucide-react";

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
      icon: <Calendar size={20} />,
      title: "Leave Management",
      text: "Streamlined leave application process with automated tracking and approvals",
    },
    {
      icon: <Award size={20} />,
      title: "OD Management",
      text: "Efficient handling of On-Duty requests for academic and professional activities",
    },
    {
      icon: <UserCheck size={20} />,
      title: "Defaulter Management",
      text: "Systematic tracking of attendance and disciplinary records",
    },
    {
      icon: <ClipboardCheck size={20} />,
      title: "Real-time Processing",
      text: "Instant updates on request status and approvals",
    },
    {
      icon: <Bell size={20} />,
      title: "Smart Notifications",
      text: "Automated alerts for status changes and pending actions",
    },
    {
      icon: <BarChart size={20} />,
      title: "Analytics & Reports",
      text: "Comprehensive reports and insights for better decision-making",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
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

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1
              className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#1f3a6e] mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              VCET Connect
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              A comprehensive academic management platform designed for VCET's
              ecosystem. Streamline administrative processes, enhance
              communication, and maintain transparency across all departments.
            </motion.p>

            {currentUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to={
                    currentUser.userType === "Staff"
                      ? "/staffdashboard"
                      : currentUser.userType === "Student"
                      ? "/profile"
                      : "/hoddash"
                  }
                  className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-[#1f3a6e] rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {currentUser.userType === "Staff"
                    ? "Access Dashboard"
                    : currentUser.userType === "Student"
                    ? "View Profile"
                    : "HOD Dashboard"}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown className="text-blue-600 w-6 h-6" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Management System
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience a unified platform that integrates various academic
              processes into one seamless system.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <p className="text-gray-600 dark:text-gray-400">
                Experience a unified platform that integrates leave management,
                OD requests, and defaulter tracking with real-time updates and
                comprehensive analytics. Designed specifically for VCET's
                academic ecosystem.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="p-1 bg-green-100 rounded-full text-green-600">
                    <CheckCircle size={16} />
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Seamless Integration
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-1 bg-green-100 rounded-full text-green-600">
                    <CheckCircle size={16} />
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Real-time Updates
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="p-1 bg-green-100 rounded-full text-green-600">
                    <CheckCircle size={16} />
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Comprehensive Analytics
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
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
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
