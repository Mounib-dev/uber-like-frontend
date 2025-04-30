import { Link } from "react-router-dom";

export default function RestaurantList() {
  const restaurants = [
    {
      id: 1,
      name: "La Bella Italia",
      description: "Cuisine italienne authentique",
      image: "https://nice.love-spots.com/wp-content/uploads/sites/2/2019/12/Gepetto_restaurant-italien-Nice_Love-Spots_01-1024x768.jpg", 
    },
    {
      id: 2,
      name: "Le Gourmet Burger",
      description: "Burgers gourmets faits maison",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/2c/f6/37/79/restaurant-front.jpg",
    },
    {
      id: 3,
      name: "La Bella Italia",
      description: "Cuisine italienne authentique",
      image: "https://nice.love-spots.com/wp-content/uploads/sites/2/2019/12/Gepetto_restaurant-italien-Nice_Love-Spots_01-1024x768.jpg", 
    },
    {
      id: 4,
      name: "Le Gourmet Burger",
      description: "Burgers gourmets faits maison",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/2c/f6/37/79/restaurant-front.jpg",
    },
    {
      id: 5,
      name: "La Bella Italia",
      description: "Cuisine italienne authentique",
      image: "https://nice.love-spots.com/wp-content/uploads/sites/2/2019/12/Gepetto_restaurant-italien-Nice_Love-Spots_01-1024x768.jpg", 
    },
    {
      id: 6,
      name: "Le Gourmet Burger",
      description: "Burgers gourmets faits maison",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/2c/f6/37/79/restaurant-front.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Restaurants Partenaires</h1>
      <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-1">{restaurant.name}</h2>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <Link
                to={`/restaurant/${restaurant.id}`}
                className="inline-block bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Voir le menu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
