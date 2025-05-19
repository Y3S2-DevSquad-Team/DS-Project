import Hero from "../components/Home/Hero";
import RestaurantList from "../components/Home/RestaurantList";
import { motion } from "framer-motion";
import RestaurantListPage from "./RestaurantListPage";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Hero background overlay */}
      <div className="absolute inset-0 z-0">
        <Hero />
        <div className="absolute inset-0 opacity-40"></div>
      </div>
      {/* Content over the hero background */}
      <div className="relative z-10">
        <motion.div className='px-4 py-10 mx-auto max-w-7xl' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          
          {/* <RestaurantList /> */}
          <RestaurantListPage />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
