import { BiRestaurant } from "react-icons/bi";
import { FiClock } from "react-icons/fi";

export default function ComeBackLater() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <div className="relative inline-block mb-8">
          <BiRestaurant className="text-6xl text-rose-600" />
          <FiClock className="text-3xl text-gray-400 animate-pulse absolute -top-2 -right-8" />
        </div>

        <h1 className="text-3xl font-light text-gray-800 mb-4">
          We're gathering insights
        </h1>

        <p className="text-gray-600 mb-6">
          We're currently analyzing restaurants in your area to provide you with
          valuable market insights. This process usually takes a few minutes.
          <br />
          <br />
          Come back later to see your restaurant's performance.
        </p>

        <div className="bg-white rounded-lg p-4 shadow-sm max-w-xs mx-auto">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <span>Scanning nearby restaurants</span>
          </div>
        </div>
      </div>
    </div>
  );
}
