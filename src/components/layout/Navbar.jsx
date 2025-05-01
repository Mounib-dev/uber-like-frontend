import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Navbar({ panier }) {
  const { isLoggedIn, logout, userRole } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

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
              <Link to="/livraison" className="text-gray-600 hover:text-green-500">
                Livraison
              </Link>
            )}

            <Link to="/panier" className="relative text-gray-600 hover:text-green-500">
              <ShoppingCart size={24} />
              {panier.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                  {panier.length}
                </span>
              )}
            </Link>

           <div className="relative">
            <User
              size={24}
              className="cursor-pointer text-gray-600 hover:text-green-500 transition duration-200"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-3 w-56 rounded-xl border bg-white shadow-xl z-20 overflow-hidden animate-fade-in">
                <div className="px-5 py-4 bg-green-50 border-b">
                  <p className="text-xs text-gray-500">Bienvenue 👋</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>

                <Link
                  to="/profile"
                  className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Voir profil
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-gray-100 transition"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>

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
