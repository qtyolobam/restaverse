import { FiX } from "react-icons/fi";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: {
    name: string;
    swiggyMenuItems: {
      id: string;
      name: string;
      price: string;
      rating: string;
      description?: string;
      imageUrl: string;
    }[];
  };
}

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #E5E7EB;
    border-radius: 20px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #D1D5DB;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #E5E7EB transparent;
  }
`;

export default function MenuModal({
  isOpen,
  onClose,
  restaurant,
}: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">{restaurant.name} Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] custom-scrollbar">
          <div className="space-y-4">
            {restaurant.swiggyMenuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex gap-4 flex-1">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      {item.rating && item.rating !== "0" && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          ★ {item.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{scrollbarStyles}</style>
      </div>
    </div>
  );
}
