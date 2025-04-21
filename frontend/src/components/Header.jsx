const Header = () => {
    return (
      <header className="bg-[var(--color-primary)] text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h1 className="text-xl font-bold">FoodExpress</h1>
          </div>
  
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for restaurants or cuisines"
                className="w-full py-2 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg 
                  className="w-5 h-5 text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
            </div>
          </div>
  
          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <button className="hover:underline hidden sm:block">Sign In</button>
            <button className="bg-white text-[var(--color-primary)] px-4 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Sign Up
            </button>
          </nav>
        </div>
      </header>
    );
  };
  
  export default Header;