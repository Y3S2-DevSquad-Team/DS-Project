import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import RestaurantListPage from './pages/RestaurantListPage';
import RestaurantMenuPage from './pages/RestaurantMenuPage';
import AdminRestaurantsPage from './pages/AdminRestaurantsPage';
import AdminAddRestaurantPage from './pages/AdminAddRestaurantPage';
import AdminMenusPage from './pages/AdminMenusPage';
import AdminAddMenuPage from './pages/AdminAddMenuPage';
import AdminOrderManagement from './pages/AdminOrderManagement';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<RestaurantListPage />} />
            <Route path="/restaurants" element={<RestaurantListPage />} />
            <Route path="/restaurants/:id" element={<RestaurantMenuPage />} />
            
            
            {/* Admin Routes */}
            <Route path="/admin/restaurants" element={<AdminRestaurantsPage />} />
           
            {/* For Restaurants */}
            <Route path="/admin/restaurants/add" element={<AdminAddRestaurantPage />} />
            <Route path="/admin/restaurants/:id/edit" element={<AdminAddRestaurantPage />} />

            {/* For Menu Items */}
            <Route path="/admin/menus/add" element={<AdminAddMenuPage />} />
            <Route path="/admin/menus/:id/edit" element={<AdminAddMenuPage />} />
            
            <Route path="/admin/menus" element={<AdminMenusPage />} />
            <Route path="/admin/menus/add" element={<AdminAddMenuPage />} />
            <Route path="/admin/menus/:id/edit" element={<AdminAddMenuPage />} />
            <Route path="/admin/restaurants/:id/menu/add" element={<AdminAddMenuPage />} />
            <Route path="admin/restaurants/:id/orders" element={<AdminOrderManagement />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;