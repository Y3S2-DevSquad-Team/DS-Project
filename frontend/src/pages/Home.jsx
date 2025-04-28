import Hero from "../components/Home/Hero";
import RestaurantList from "../components/Home/RestaurantList";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Hero />
      <motion.div className='px-4 py-10 mx-auto max-w-7xl' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className='mb-6 text-2xl font-bold text-gray-800'>Popular Restaurants</h2>
        <RestaurantList />
      </motion.div>
    </div>
  );
};

export default Home;
