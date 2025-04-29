import { useState } from "react";

export default function Panier({ panier, setPanier, commandes, setCommandes }) {
  const [showHistorique, setShowHistorique] = useState(false);

  const augmenterQuantite = (index) => {
    const updated = [...panier];
    updated[index].quantity++;
    setPanier(updated);
  };

  const diminuerQuantite = (index) => {
    const updated = [...panier];
    if (updated[index].quantity > 1) {
      updated[index].quantity--;
    } else {
      updated.splice(index, 1);
    }
    setPanier(updated);
  };

  const supprimerProduit = (index) => {
    const updated = [...panier];
    updated.splice(index, 1);
    setPanier(updated);
  };

  const commander = () => {
    if (panier.length > 0) {
      setCommandes((prev) => [...prev, { items: panier, date: new Date() }]);
      setPanier([]);
    }
  };

  const total = panier.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>

      {panier.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <>
          <div className="space-y-6">
            {panier.map((item, index) => (
              <div key={index} className="flex bg-gray-100 rounded-lg shadow p-4 items-center justify-between">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 ml-4">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="mt-1 font-medium">{item.price} €</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => diminuerQuantite(index)}
                    className="bg-red-500 text-white w-8 h-8 rounded-full"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => augmenterQuantite(index)}
                    className="bg-green-500 text-white w-8 h-8 rounded-full"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => supprimerProduit(index)}
                  className="text-red-600 font-bold ml-4"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right text-xl font-bold text-black">
            Total : {total} €
          </div>

          <div className="text-right mt-4">
            <button
              onClick={commander}
              className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-lg"
            >
              Passer la commande
            </button>
          </div>
        </>
      )}

      <div className="mt-10">
        <button
          onClick={() => setShowHistorique(!showHistorique)}
          className="text-blue-600 underline"
        >
          {showHistorique ? "Masquer l'historique" : "Voir l'historique des commandes"}
        </button>
      </div>

      {showHistorique && commandes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Commandes passées</h2>
          <div className="space-y-4">
            {commandes.map((commande, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">
                  Le {new Date(commande.date).toLocaleString()}
                </p>
                {commande.items.map((item, j) => (
                  <div key={j} className="flex justify-between text-sm">
                    <span>{item.quantity}× {item.name}</span>
                    <span>{item.price * item.quantity} €</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
