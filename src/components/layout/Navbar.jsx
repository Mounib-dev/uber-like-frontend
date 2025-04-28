import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-800">UberEatApp</div>
      <div className="space-x-6">
        <Link to="/menu" className="text-gray-600 hover:text-blue-500">Menu</Link>
        <Link to="/commandes" className="text-gray-600 hover:text-green-500">Commandes</Link>
        <Link to="/cuisine" className="text-gray-600 hover:text-green-500">Cuisine</Link>
        <Link to="/livraison" className="text-gray-600 hover:text-green-500">Livraison</Link>
        <Link to="/profil" className="text-gray-600 hover:text-green-500">Profil</Link>
      </div>
    </nav>
  );
}
