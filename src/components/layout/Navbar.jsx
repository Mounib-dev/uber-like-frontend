import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Navbar({panier}) {
  const { isLoggedIn, logout, userRole } = useAuth();
  console.log(userRole);
  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="text-2xl font-bold text-gray-800">UberEatADAMA</div>
      <div className="flex items-center space-x-6">
        {isLoggedIn && (
          <>
            {userRole === "client" && (
              <>
              <Link
                to="/restaurants"
                className="text-gray-600 hover:text-green-500"
              >
                Restaurants
              </Link>
               <Link to="/commandes" className="text-gray-600 hover:text-green-500">
               Commandes
             </Link>
             </>
            )}

           
{userRole === "chef" && (
              <Link
                to="/ChefList"
                className="text-gray-600 hover:text-green-500"
              >
                Commandes
              </Link>
            )}

            {userRole === "livreur" && (
              <Link
                to="/livraison"
                className="text-gray-600 hover:text-green-500"
              >
                Livraison
              </Link>
            )}

            <LogOut
              onClick={logout}
              className="text-gray-600 hover:text-green-500"
            />

          <Link
          to="/panier"
          className="relative text-gray-600 hover:text-green-500"
        >
          <ShoppingCart size={24} />
          {panier.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white animate-ping-fast">
              {panier.length}
            </span>
          )}
        </Link>
          </>
        )}

        {!isLoggedIn && (
          <Link to="/login" className="text-gray-600 hover:text-green-500">
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}
