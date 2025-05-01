import { useParams, useNavigate } from "react-router-dom";

const restaurantData = {
  1: {
    name: "La Bella Italia",
    menu: [
      {
        id: 1,
        nom: "Pizza Margherita",
        description: "Tomate, mozzarella, basilic frais",
        prix: 10,
        image: "https://media.istockphoto.com/id/1442417585/fr/photo/personne-recevant-un-morceau-de-pizza-au-pepperoni-au-fromage.jpg?s=612x612&w=0&k=20&c=xNz2rodZQQARx16BlXTkht9E19aw4ziOMm6UOjW5DKM=",
      },
      {
        id: 2,
        nom: "Pâtes Carbonara",
        description: "Lardons fumés, crème légère, parmesan",
        prix: 11,
        image: "https://img.cuisineaz.com/1200x675/2023/04/11/i192604-pates-a-la-carbonara.webp",
      },
    ],
  },
  2: {
    name: "Le Gourmet Burger",
    menu: [
      {
        id: 3,
        nom: "Burger Gourmet",
        description: "Boeuf 100%, cheddar affiné, sauce maison",
        prix: 12,
        image: "https://www.kikkoman.fr/fileadmin/_processed_/2/b/csm_403-recipe-page-gourmet-beef-burger-with-caramelised-red-onions_desktop_06f6dd43fe.jpg",
      },
      {
        id: 4,
        nom: "Tacos épicé",
        description: "Poulet mariné, légumes frais, sauce piquante",
        prix: 8,
        image: "https://www.ermitage.com/wp-content/uploads/2024/08/tacos-poulet-epices-munster-web.jpg",
      },
    ],
  },
  3: {
    name: "Le cedre",
    menu: [
      {
        id: 5,
        nom: "Mezzé libanais",
        description: "Houmous, taboulé, falafel, moutabal",
        prix: 14,
        image: "https://images.radio-canada.ca/v1/alimentation/recette/4x3/planche-mezze-libanais-ogleman.jpg",
      },
      {
        id: 6,
        nom: "Chawarma poulet",
        description: "Poulet mariné, pain pita, légumes frais",
        prix: 10,
        image: "https://recettedebase.com/wp-content/uploads/2016/08/shawarma2.jpg",
      },
    ],
  },
  4: {
    name: "Mama Africa",
    menu: [
      {
        id: 7,
        nom: "Poulet Yassa",
        description: "Poulet mariné aux oignons et citron, servi avec du riz",
        prix: 13,
        image: "https://static.wixstatic.com/media/504b32_85c178d1e3dc4bb4a6032d81e7bfffc5~mv2.jpg/v1/fill/w_528,h_352,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/504b32_85c178d1e3dc4bb4a6032d81e7bfffc5~mv2.jpg",
      },
      {
        id: 8,
        nom: "Mafé",
        description: "Ragoût de bœuf à la sauce d'arachide",
        prix: 14,
        image: "https://cdn.aistoucuisine.com/assets/c7c393fe-31a7-4d6a-baf0-d16b2817cd60/mafe-kandia-gombo-2.jpg.webp?format=webp&quality=75&width=1536",
      },
    ],
  },
  5: {
    name: "sushi express",
    menu: [
      {
        id: 9,
        nom: "Sushi saumon",
        description: "Sushi de riz vinaigré avec tranche de saumon cru",
        prix: 9,
        image: "https://www.toppits.ch/portal/pics/Rezepte/Sushi/IMG_4-1_Teaser-738x595.jpg"},
      {
        id: 10,
        nom: "California Roll",
        description: "Crabe, avocat, concombre, riz",
        prix: 10,
        image: "https://cdn.chefclub.tools/uploads/recipes/cover-thumbnail/3c15c236-4da9-4dcf-9bd2-7358453f1cd0_kVgNKzC.jpg",
      },
    ],
  },
  6: {
    name: "hawaii hawaii",
    menu: [
      {
        id: 11,
        nom: "Poké bowl saumon",
        description: "Riz, saumon cru, avocat, edamame, mangue",
        prix: 12,
        image: "https://fac.img.pmdstatic.net/fit/~1~fac~2024~06~20~4645ccc4-115b-4f3a-a748-9b06e0c9c359.jpeg/850x478/quality/80/crop-from/center/focus-point/1245%2C788/poke-bowl-saumon-avocat-et-mangue.jpeg",
      },
      {
        id: 12,
        nom: "Poké bowl crevettes",
        description: "Crevettes, riz, légumes croquants, sauce sucrée salée",
        prix: 13,
        image: "https://images.ricardocuisine.com/services/recipes/1-1581695524.jpg",
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
    const itemWithQty = { ...item, quantite: 1 };
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
            alt={item.nom}
            className="w-full h-56 object-cover"
          />
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-1">{item.nom}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-gray-800 font-medium text-lg">{item.prix} €</p>
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
