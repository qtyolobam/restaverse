// src/pages/Dashboard.tsx
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiMenu,
  FiClock,
  FiStar,
  FiLogOut,
} from "react-icons/fi";
import { BiRestaurant } from "react-icons/bi";
import ComeBackLater from "./ComeBackLater";

import api from "../lib/axios";
import Loader from "../components/Loader";
import MenuModal from "../components/MenuModal";

interface Restaurant {
  id: string;
  name: string;
  pincode: string;
  menuItems: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
}

interface SwiggyRestaurant {
  id: string;
  name: string;
  rating: string;
  deliveryTime: string;
  cuisines: string[];
  area: string;
  swiggyMenuItems: SwiggyMenuItem[];
}

interface SwiggyMenuItem {
  id: string;
  name: string;
  price: string;
  rating: string;
  imageUrl: string;
}

// Orange gradient for the bg
const gradientStyles = `
  .gradient-circle {
    position: fixed;
    top: -25%;
    right: -25%;
    width: 300vh;
    height: 300vh;
    border-radius: 50%;
    background: radial-gradient(circle closest-side, rgba(251, 146, 60, 0.15) 0%, rgba(251, 146, 60, 0) 100%);
    pointer-events: none;
    z-index: 0;
    transform: translate(25%, -25%);
  }
`;

export default function Dashboard() {
  // Atomize the context, global states like user, works for now
  const { user, logout } = useAuth();
  const [userRestaurants, setUserRestaurants] = useState<Restaurant[]>([]);
  const [swiggyRestaurants, setSwiggyRestaurants] = useState<
    SwiggyRestaurant[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<SwiggyRestaurant | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  useEffect(() => {
    // A chained api request needed because how the backend has been written
    setUserRestaurants(user?.restaurants || []);
    setIsLoading(true);
    setIsScraping(true);
    api
      .get(`/users/previous-scraped-data`)
      .then((res) => {
        console.log(res.data.msgCode);
        // Some confusing custom status codes
        if (res.data.msgCode === 404) {
          // Meaning that there is no scrape yet (no possible was some bug previously)
          setIsScraping(true);
          api.post(`/users/scrape`).then((res) => {
            console.log(res.data);
          });
        } else if (res.data.msgCode === 400) {
          // There is a scrape request but yet to be completed (in progress)
          setIsScraping(true);
          setIsLoading(false);
        } else if (res.status === 200) {
          // Data is fetched and ready to be displayed
          console.log("test");
          setSwiggyRestaurants(res.data.restaurants);
          setIsScraping(false);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Basic statistics
  const getRestaurantStats = (restaurant: Restaurant) => {
    const menuItemCount = restaurant.menuItems.length;
    const avgPrice =
      restaurant.menuItems.reduce(
        (acc, item) => acc + parseFloat(item.price),
        0
      ) / menuItemCount;

    return {
      menuItemCount,
      avgPrice: avgPrice.toFixed(0),
    };
  };

  // Same here
  const getMarketStats = () => {
    const allSwiggyItems = swiggyRestaurants.flatMap((r) => r.swiggyMenuItems);
    const avgMarketPrice =
      allSwiggyItems.reduce((acc, item) => acc + parseFloat(item.price), 0) /
      allSwiggyItems.length;

    return {
      restaurantCount: swiggyRestaurants.length,
      avgPrice: avgMarketPrice.toFixed(0),
    };
  };

  return (
    <>
      {isScraping ? (
        // Meaning data hasnt been scraped yet
        <ComeBackLater />
      ) : isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="min-h-screen bg-white">
            <div className="gradient-circle" />
            <style>{gradientStyles}</style>

            <div className="p-8 max-w-7xl mx-auto relative z-10">
              <div className="mb-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {user?.image && (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-1">
                        Welcome, {user?.name?.split(" ")[0] || "there"}! 👋
                      </h1>
                      <p className="text-sm text-gray-500 font-medium">
                        Take a look into your company
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/*Again a unknown condition was a bug previously, this is because if the user has onboarded then the user will always have a restaurant*/}
              {userRestaurants.length === 0 ? (
                <div className="mb-12 bg-white rounded-2xl shadow-sm p-8 text-center relative">
                  <BiRestaurant className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    No restaurants yet
                  </h2>
                  <p className="text-gray-500 text-lg mb-6">
                    You haven't added any restaurants to your profile.
                  </p>
                  {/* Demo button doesnt work btw :) */}
                  <button className="px-8 py-3 bg-rose-600 text-white rounded-full text-sm font-medium hover:bg-rose-700 transition-colors">
                    Add Restaurant
                  </button>
                </div>
              ) : (
                userRestaurants.map((restaurant) => {
                  const stats = getRestaurantStats(restaurant);
                  const marketStats = getMarketStats();

                  return (
                    <div
                      key={restaurant.id}
                      className="mb-12 bg-white rounded-2xl shadow-sm p-8 relative"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            {restaurant.name}
                          </h2>
                          <p className="text-gray-500 font-medium">
                            Pincode: {restaurant.pincode}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <FiMenu className="text-rose-600 text-xl" />
                            <h3 className="text-sm font-semibold text-gray-900">
                              Menu Items
                            </h3>
                          </div>
                          <p className="text-3xl font-light text-gray-900">
                            {stats.menuItemCount}
                          </p>
                          <p className="text-sm text-gray-500 mt-2 font-medium">
                            vs market avg{" "}
                            {(marketStats.restaurantCount * 15).toFixed(0)}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <FiTrendingUp className="text-rose-600 text-xl" />
                            <h3 className="text-sm font-semibold text-gray-900">
                              Avg. Price
                            </h3>
                          </div>
                          <p className="text-3xl font-light text-gray-900">
                            ₹{stats.avgPrice}
                          </p>
                          <p className="text-sm text-gray-500 mt-2 font-medium">
                            vs market avg ₹{marketStats.avgPrice}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <BiRestaurant className="text-rose-600 text-xl" />
                            <h3 className="text-sm font-semibold text-gray-900">
                              Closest Competitors
                            </h3>
                          </div>
                          <p className="text-3xl font-light text-gray-900">
                            {marketStats.restaurantCount}
                          </p>
                          <p className="text-sm text-gray-500 mt-2 font-medium">
                            in your area
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <FiStar className="text-rose-600 text-xl" />
                            <h3 className="text-sm font-semibold text-gray-900">
                              Market Position
                            </h3>
                          </div>
                          <p className="text-3xl font-light text-gray-900">
                            Top 10%
                          </p>
                          <p className="text-sm text-gray-500 mt-2 font-medium">
                            in price competitiveness
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Market Overview (replaced by the come back soon page )*/}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Market Overview
                </h2>
                {swiggyRestaurants.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <FiClock className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      No market data available
                    </h3>
                    <p className="text-gray-500 text-lg">
                      We're currently gathering data about restaurants in your
                      area.
                      <br />
                      Check back soon for market insights.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {swiggyRestaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedRestaurant(restaurant);
                          setIsMenuModalOpen(true);
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {restaurant.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                              {restaurant.area}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                            <FiStar className="text-green-600 text-xs" />
                            <span className="text-sm text-green-600 font-medium">
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {restaurant.cuisines.map((cuisine, index) => (
                            <span
                              key={index}
                              className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                            >
                              {cuisine}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                          <FiClock />
                          <span>{restaurant.deliveryTime} mins delivery</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedRestaurant && (
            <MenuModal
              isOpen={isMenuModalOpen}
              onClose={() => {
                setIsMenuModalOpen(false);
                setSelectedRestaurant(null);
              }}
              restaurant={selectedRestaurant}
            />
          )}
        </>
      )}
    </>
  );
}
