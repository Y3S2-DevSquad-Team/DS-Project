import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.section
      className='h-[60vh] bg-cover bg-center flex items-center justify-center'
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/flat-food-youtube-thumbnail_23-2149034497.jpg?t=st=1745762816~exp=1745766416~hmac=e5ac9d2b0d5c89e0330eba6c2931ee66e04d257824b034534e8ec115d9be3152&w=996')",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}>
      <div className='px-8 py-4 pb-32 text-center bg-white shadow-lg mb-28 bg-opacity-80 rounded-xl'>
        <h1 className='mt-1 text-4xl font-bold text-green-600 md:text-5xl'>Your favorite meals, delivered fast</h1>
        <p className='text-lg text-gray-700'>Order now from the best restaurants in your area</p>
      </div>
    </motion.section>
  );
};

export default Hero;
