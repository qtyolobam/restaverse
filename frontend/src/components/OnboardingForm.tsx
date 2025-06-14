import { useState } from "react";
import { FiArrowRight, FiPlus, FiTrash2 } from "react-icons/fi";
import { BiRestaurant } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import api from "../lib/axios";
import Loader from "./Loader";

interface MenuItem {
  id: string;
  name: string;
  price: string;
}

interface RestaurantData {
  name: string;
  pincode: string;
  cuisines: string;
  menuItems: MenuItem[];
}

export default function OnboardingForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: "",
    pincode: "",
    cuisines: "",
    menuItems: [],
  });

  // Restaurant details
  const validateStep1 = () => {
    return (
      restaurantData.name.trim() &&
      restaurantData.pincode.trim() &&
      restaurantData.cuisines.trim() &&
      /^\d{6}$/.test(restaurantData.pincode)
    );
  };

  // Menu items details
  const validateStep2 = () => {
    return restaurantData.menuItems.every(
      (item) =>
        item.name.trim() && item.price.trim() && /^\d+$/.test(item.price)
    );
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and max 6 digits
    if (value && !/^\d{0,6}$/.test(value)) return;

    setRestaurantData((prev) => ({
      ...prev,
      pincode: value,
    }));

    // Validate and show toast
    if (value.length === 6) {
      if (!/^\d{6}$/.test(value)) {
        toast.error("Pincode must be a 6-digit number", {
          id: "pincode-error",
          duration: 1500,
        });
      }
    } else if (value.length > 0) {
      toast.error("Pincode must be 6 digits", {
        id: "pincode-error",
        duration: 1500,
      });
    }
  };

  const handlePriceChange = (id: string, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      toast.error("Price must be a valid number", {
        id: `price-error-${id}`,
        duration: 1500,
      });
      return;
    }

    setRestaurantData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) =>
        item.id === id ? { ...item, price: value } : item
      ),
    }));
  };

  const updateMenuItem = (
    id: string,
    field: "name" | "price",
    value: string
  ) => {
    if (field === "price") {
      handlePriceChange(id, value);
    } else {
      setRestaurantData((prev) => ({
        ...prev,
        menuItems: prev.menuItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    }
  };

  const addMenuItem = () => {
    setRestaurantData((prev) => ({
      ...prev,
      menuItems: [
        ...prev.menuItems,
        { id: crypto.randomUUID(), name: "", price: "" },
      ],
    }));
    toast.success("New menu item added", { duration: 1500 });
  };

  const removeMenuItem = (id: string) => {
    setRestaurantData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((item) => item.id !== id),
    }));
    toast.success("Menu item removed", { duration: 1500 });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      toast.success("Restaurant created successfully!");

      // Create the restaurant
      await api.post(`/restaurants/create`, {
        name: restaurantData.name,
        pincode: restaurantData.pincode,
        menuItems: restaurantData.menuItems.map((item) => ({
          name: item.name,
          price: item.price,
        })),
      });

      // Here is why the dashboard mentioned bug wont occur
      await api.post(`/users/scrape`, {
        pincode: restaurantData.pincode,
        cuisines: restaurantData.cuisines.split(",").map((c) => c.trim()),
        limit: 5,
      });

      // Handle success
      window.location.reload();
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast.error("Failed to create restaurant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <Loader />}
      <div className="flex justify-center items-center h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <div className="w-full max-w-2xl mx-auto p-6">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 1
                    ? "bg-rose-600 text-white"
                    : "bg-rose-100 text-rose-600"
                }`}
              >
                1
              </div>
              <div className="w-20 h-1 bg-rose-100">
                <div
                  className={`h-full bg-rose-600 transition-all duration-300 ${
                    step === 2 ? "w-full" : "w-0"
                  }`}
                />
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 2
                    ? "bg-rose-600 text-white"
                    : "bg-rose-100 text-rose-600"
                }`}
              >
                2
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BiRestaurant className="text-4xl text-rose-600" />
              <h1 className="text-2xl font-light text-gray-800">
                {step === 1 ? "Restaurant Details" : "Menu Items"}
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              {step === 1
                ? "Let's start with the basics"
                : "Add your restaurant's menu items"}
            </p>
          </div>

          {/*Restaurant Details Form */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={restaurantData.name}
                  onChange={(e) =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Enter restaurant name"
                />
              </div>
              <div>
                <label
                  htmlFor="cuisines"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Cuisines
                </label>
                <input
                  type="text"
                  id="cuisines"
                  value={restaurantData.cuisines}
                  onChange={(e) =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      cuisines: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Enter cuisines (comma-separated e.g. Italian, Chinese)"
                />
              </div>
              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={restaurantData.pincode}
                  onChange={handlePincodeChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Enter 6-digit pincode"
                />
              </div>
            </div>
          )}

          {/*  Menu Items */}
          {step === 2 && (
            <div className="space-y-6">
              {restaurantData.menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg group"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateMenuItem(item.id, "name", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-shadow mb-2"
                      placeholder="Item name"
                    />
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) =>
                        updateMenuItem(item.id, "price", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-shadow"
                      placeholder="Price (numbers only)"
                    />
                  </div>
                  <button
                    onClick={() => removeMenuItem(item.id)}
                    className="mt-2 p-2 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                onClick={addMenuItem}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <FiPlus />
                Add Another Item
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            {step === 1 ? (
              <button
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                    toast.success("Restaurant details saved!");
                  } else {
                    toast.error("Please fill in all fields correctly");
                  }
                }}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <FiArrowRight />
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (validateStep2()) {
                      handleSubmit();
                    } else {
                      toast.error("Please fill in all menu items correctly");
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? "Creating..." : "Create Restaurant"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
