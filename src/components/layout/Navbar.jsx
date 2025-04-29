import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; 

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-800">UberEatCopy</div>
      <div className="flex items-center space-x-6">
        <Link to="/restaurants" className="text-gray-600 hover:text-green-500">
          Restaurants
        </Link>
        <Link to="/order" className="text-gray-600 hover:text-green-500">
          Commandes
        </Link>
        <Link to="/livraison" className="text-gray-600 hover:text-green-500">
          Livraison
        </Link>
        <Link to="/login" className="text-gray-600 hover:text-green-500">
          Connexion
        </Link>

       
        <Link to="/panier" className="relative text-gray-600 hover:text-green-500">
          <ShoppingCart size={24} />
          
           <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span> 
        </Link>
      </div>
    </nav>
  );
}
