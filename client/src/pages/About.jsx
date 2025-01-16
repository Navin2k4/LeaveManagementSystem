import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FileText,
  Clock,
  AlertTriangle,
  Users,
  BookOpen,
  ChevronDown,
  Computer,
} from "lucide-react";
import { Carousel } from "flowbite-react";

const systems = [
  {
    name: "Leave Management System",
    icon: FileText,
    developers: [
      "Navin Kumaran - 22CSEB48",
      "Vinoth Kumar - 22CSEB59",
      "Dinesh Kumar - 22CSEB35",
      "Udhaya Chandra Pandiyan - 22CSEB57",
    ],
  },
  {
    name: "OD Management System",
    icon: Clock,
    developers: [
      "Manasha Devi T G - 22CSEB16",
      "Ritika Sachdeva - 22CSEB22",
      "Matcharani J - 22CSEB17",
    ],
  },
  {
    name: "Defaulter Management System",
    icon: AlertTriangle,
    developers: [
      "Developer 5 - ID5",
      "Developer 6 - ID6",
      "Developer 7 - ID7",
      "Developer 8 - ID8",
    ],
  },
  {
    name: "Our Project Coordinators",
    icon: Users,
    developers: [
      "Mrs.S.Padmadevi - Assistant Professor, CSE",
      "Ms.J. Shanthalakshmi Revathy - Assistant Professor, CSE",
      "Dr.A.M.Rajeswari - Associate Professor, CSE",
    ],
  },
];

const About = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <motion.div
            className="relative z-10 text-center"
            style={{ opacity, scale }}
          >
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            >
              Welcome to VCET Connect
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl mb-8 text-gray-800"
            >
              Revolutionizing academic administration through innovative digital
              solutions
            </motion.p>
            <motion.a
              href="#about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="animate-bounce inline-block"
            >
              <ChevronDown size={48} className="text-white" />
            </motion.a>
          </motion.div>
        </section>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-200 flex items-center gap-2 p-4">
            <Computer className="text-[#1f3a6e]" />
            <h2 className="text-lg font-semibold text-black">
              Systems Implemented
            </h2>
          </div>

          {/* Systems Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {systems.map((system, index) => (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-[#1f3a6e] dark:text-blue-400">
                    <system.icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {system.name}
                  </h3>
                </div>
                <div className="space-y-2">
                  {system.developers.map((developer, idx) => (
                    <p
                      key={idx}
                      className="text-md text-gray-600 dark:text-gray-300 pl-11"
                    >
                      {developer}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-200 p-4">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-[#1f3a6e]" />
              <h2 className="text-lg font-semibold text-black">
                Our Vision & Mission
              </h2>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <h4 className="text-md font-semibold mb-2 text-[#1f3a6e] dark:text-blue-400">
                Our Vision
              </h4>
              <p className="text-md text-gray-600 dark:text-gray-300">
                To revolutionize academic administration through innovative
                digital solutions that enhance the educational experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <h4 className="text-md font-semibold mb-2 text-[#1f3a6e] dark:text-blue-400">
                Our Mission
              </h4>
              <p className="text-md text-gray-600 dark:text-gray-300">
                Creating seamless connections between students, faculty, and
                administration while maintaining transparency and efficiency.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <h4 className="text-md font-semibold mb-2 text-[#1f3a6e] dark:text-blue-400">
                Our Values
              </h4>
              <p className="text-md text-gray-600 dark:text-gray-300">
                Innovation, integrity, and excellence in every aspect of our
                service to the VCET community.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-200 p-4">
            <h2 className="text-lg font-semibold text-black">
              Why Choose VCET Connect?
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                {[
                  "Streamlined Leave Management",
                  "Real-time Status Updates",
                  "Secure Data Handling",
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#1f3a6e] dark:bg-blue-400" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                {[
                  "Automated Notifications",
                  "Intuitive User Interface",
                  "24/7 System Availability",
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#1f3a6e] dark:bg-blue-400" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-md font-semibold text-center text-gray-500 dark:text-gray-400 mt-6"
            >
              A proud initiative of the Department of Computer Science and
              Engineering, VCET
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
