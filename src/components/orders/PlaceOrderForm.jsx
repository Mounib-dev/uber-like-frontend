import { useState } from "react";

export default function PlaceOrderForm() {
  const [clientId, setClientId] = useState("");
  const [plats, setPlats] = useState([{ name: "", price: "", status: "En attente" }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 16)); 
  const [status, setStatus] = useState("En attente");

  const handlePlatChange = (index, field, value) => {
    const newPlats = [...plats];
    newPlats[index][field] = value;
    setPlats(newPlats);
    updateTotalPrice(newPlats);
  };

  const addPlat = () => {
    setPlats([...plats, { name: "", price: "", status: "En attente" }]);
  };

  const updateTotalPrice = (plats) => {
    const total = plats.reduce((sum, plat) => sum + Number(plat.price || 0), 0);
    setTotalPrice(total);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      clientId,
      plats,
      totalPrice,
      createdAt,
      status,
    };
    console.log(orderData);
    // TODO: envoyer au backend avec ton service API
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-black text-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Passer une commande</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Nom du client</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full p-3 rounded bg-white text-black focus:outline-none"
            placeholder="Entrez votre nom"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Plats</h3>
          {plats.map((plat, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nom du plat"
                value={plat.name}
                onChange={(e) => handlePlatChange(index, "name", e.target.value)}
                className="p-2 rounded bg-white text-black focus:outline-none"
              />
              <input
                type="number"
                placeholder="Prix"
                value={plat.price}
                onChange={(e) => handlePlatChange(index, "price", e.target.value)}
                className="p-2 rounded bg-white text-black focus:outline-none"
              />
              <select
                value={plat.status}
                onChange={(e) => handlePlatChange(index, "status", e.target.value)}
                className="p-2 rounded bg-white text-black focus:outline-none"
              >
                <option>En attente</option>
                <option>En préparation</option>
                <option>Prêt</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={addPlat}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Ajouter un plat
          </button>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Prix total</label>
          <input
            type="text"
            value={totalPrice}
            readOnly
            className="w-full p-3 rounded bg-white text-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Date de création</label>
          <input
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            className="w-full p-3 rounded bg-white text-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Statut de la commande</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 rounded bg-white text-black focus:outline-none"
          >
            <option>En attente</option>
            <option>En préparation</option>
            <option>Prêt</option>
            <option>Livré</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-white text-black font-bold rounded hover:bg-gray-200"
        >
          Envoyer la commande
        </button>
      </form>
    </div>
  );
}
