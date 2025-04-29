import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer 
      className="py-4 mt-12 text-gray-600 bg-white shadow-inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-4 mx-auto text-sm text-center max-w-7xl">
        © 2025 YumGo. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
