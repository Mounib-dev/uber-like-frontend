import { useParams, useNavigate } from "react-router-dom";

const restaurantData = {
  1: {
    name: "La Bella Italia",
    menu: [
      {
        id: 1,
        name: "Pizza Margherita",
        description: "Tomate, mozzarella, basilic frais",
        price: 10,
        image: "https://media.istockphoto.com/id/1442417585/fr/photo/personne-recevant-un-morceau-de-pizza-au-pepperoni-au-fromage.jpg?s=612x612&w=0&k=20&c=xNz2rodZQQARx16BlXTkht9E19aw4ziOMm6UOjW5DKM=",
      },
      {
        id: 2,
        name: "Pâtes Carbonara",
        description: "Lardons fumés, crème légère, parmesan",
        price: 11,
        image: "https://img.cuisineaz.com/1200x675/2023/04/11/i192604-pates-a-la-carbonara.webp",
      },
    ],
  },
  2: {
    name: "Le Gourmet Burger",
    menu: [
      {
        id: 3,
        name: "Burger Gourmet",
        description: "Boeuf 100%, cheddar affiné, sauce maison",
        price: 12,
        image: "https://www.kikkoman.fr/fileadmin/_processed_/2/b/csm_403-recipe-page-gourmet-beef-burger-with-caramelised-red-onions_desktop_06f6dd43fe.jpg",
      },
      {
        id: 4,
        name: "Tacos épicé",
        description: "Poulet mariné, légumes frais, sauce piquante",
        price: 8,
        image: "https://www.ermitage.com/wp-content/uploads/2024/08/tacos-poulet-epices-munster-web.jpg",
      },
    ],
  },
};

export default function RestaurantMenu({ setPanier }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const restaurant = restaurantData[id];

  if (!restaurant) return <p className="text-center mt-20 text-gray-600">Restaurant introuvable.</p>;

  const handleOrder = (item) => {
    const itemWithQty = { ...item, quantity: 1 };
    setPanier((prev) => [...prev, itemWithQty]);
    navigate("/panier");
  };
  

  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center">{restaurant.name}</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {restaurant.menu.map((item) => (
          <div
          key={item.id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover"
          />
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-1">{item.name}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-gray-800 font-medium text-lg">{item.price} €</p>
            </div>
            <button
              onClick={() => handleOrder(item)}
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
        
        ))}
      </div>
    </div>
  );
}
