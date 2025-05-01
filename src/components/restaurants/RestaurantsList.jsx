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
      name: "Le cedre",
      description: "Cuisine libanaise authentique",
      image: "https://res.cloudinary.com/tf-lab/image/upload/restaurant/d100b150-9fd7-4943-9d1f-eabdd9e7bfba/4a89b69a-c1fe-4ed7-806a-aaab2648f7f6.jpg", 
    },
    {
      id: 4,
      name: "Mama Africa",
      description: "Cuisines africaines , une variété de plats",
      image: "https://res.cloudinary.com/tf-lab/image/upload/restaurant/596c96a9-a516-486c-adcc-d54ce6e5bae5/5010481e-9701-4474-84da-ad7cda4f1bfa.jpg",
    },
    {
      id: 5,
      name: " sushi express",
      description: "restaurant 100% sushi",
      image: "https://medias.cotesushi.com/restaurants/20/gallery/1_Restaurant_cotesushi_Grenoble_contoir.webp", 
    },
    {
      id: 6,
      name: "hawaii hawaii",
      description: "Découvrez nos spécialités",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/de/11/58/kpc-outdoor-lanai-at.jpg",
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
