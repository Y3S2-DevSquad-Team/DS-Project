import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantList from '../components/restaurant/RestaurantList';
import Button from '../components/common/Button';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/restaurants');
        setRestaurants(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div className="text-center py-12">Loading restaurants...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Craving something delicious?</h1>
          <p className="text-xl mb-6">Get your favorite food delivered in minutes</p>
          <Link to="/restaurants">
            <Button variant="accent" className="px-8 py-3 text-lg">
              Order Now
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Popular Restaurants</h2>
          <Link to="/restaurants" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <RestaurantList restaurants={restaurants.slice(0, 3)} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🍴',
              title: 'Choose Restaurant',
              description: 'Browse through our list of curated restaurants',
            },
            {
              icon: '🍔',
              title: 'Select Food',
              description: 'Pick your favorite dishes from the menu',
            },
            {
              icon: '🚚',
              title: 'Fast Delivery',
              description: 'Get your food delivered to your doorstep',
            },
          ].map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;