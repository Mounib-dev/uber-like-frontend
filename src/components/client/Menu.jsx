import { useState } from "react";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Pizza Margherita", description: "Tomate, mozzarella, basilic frais", price: 10 },
    { id: 2, name: "Burger Gourmet", description: "Boeuf 100%, cheddar affiné, sauce maison", price: 12 },
    { id: 3, name: "Salade César", description: "Poulet grillé, croûtons, parmesan", price: 9 },
    { id: 4, name: "Pâtes Carbonara", description: "Lardons fumés, crème légère, parmesan", price: 11 },
    { id: 5, name: "Tacos épicé", description: "Poulet mariné, légumes frais, sauce piquante", price: 8 },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10">Notre Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-400 text-sm mb-6">{item.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">{item.price} €</span>
              <button className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
                Commander
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
