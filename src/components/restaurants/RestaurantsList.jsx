import Menu from "./Menu";

export default function RestaurantList() {
  const restaurants = [
    {
      id: 1,
      name: "La Bella Italia",
      menu: [
        { id: 1, name: "Pizza Margherita", description: "Tomate, mozzarella, basilic frais", price: 10 },
        { id: 2, name: "Pâtes Carbonara", description: "Lardons fumés, crème légère, parmesan", price: 11 },
      ],
    },
    {
      id: 2,
      name: "Le Gourmet Burger",
      menu: [
        { id: 3, name: "Burger Gourmet", description: "Boeuf 100%, cheddar affiné, sauce maison", price: 12 },
        { id: 4, name: "Tacos épicé", description: "Poulet mariné, légumes frais, sauce piquante", price: 8 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10">Nos Restaurants</h1>
      <div className="space-y-12 max-w-7xl mx-auto">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id}>
            <h2 className="text-3xl font-semibold mb-6 border-b pb-2">{restaurant.name}</h2>
            <Menu items={restaurant.menu} />
          </div>
        ))}
      </div>
    </div>
  );
}
