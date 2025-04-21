import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import RestaurantList from './components/RestaurantList';

const App = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurants from your backend
    fetch('http://localhost:5001/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CategoryTabs />
        <RestaurantList restaurants={restaurants} />
      </main>
    </div>
  );
};

export default App;