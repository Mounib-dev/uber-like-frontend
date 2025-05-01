import { useEffect, useState } from "react";
import axios from "axios";

export default function ChefList() {
  const [commandes, setCommandes] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_GATEWAY}/commande-service/list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data.commandes);
        const allCommandes = Array.isArray(response.data)
          ? response.data
          : response.data.commandes || [];

        setCommandes(allCommandes);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    };

    fetchCommandes();
  }, []);

  const accepterCommande = async (commande) => {
    try {
      setLoadingId(commande.id);

      await axios.patch(
        `${import.meta.env.VITE_API_GATEWAY}/commande-service/update`,
        {
          id: commande.id,
          status: "en préparation",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedCommandes = commandes.map((cmd) =>
        cmd.id === commande.id ? { ...cmd, status: "en préparation" } : cmd
      );

      setCommandes(updatedCommandes);
      alert("Commande acceptée, le client a été informé.");
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
      alert("Impossible de changer le statut.");
    } finally {
      setLoadingId(null);
    }
  };

  const commandesEnAttente = commandes.filter(
    (commande) => commande.status === "en attente"
  );

  return (
    <div className="p-6 max-w-5xl mx-auto ">
      <h1 className="text-3xl font-bold mb-6 text-center">Commandes des clients</h1>
      {commandesEnAttente.length === 0 ? (
        <p className="text-gray-500">Aucune commande en attente.</p>
      ) : (
        <div className="overflow-x-auto mt-5">
          <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Articles</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Total</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {commandesEnAttente
                .slice()
                .reverse()
                .map((commande, index) => {
                  const total = commande.plats?.reduce(
                    (sum, plat) => sum + (plat.prix || 0) * (plat.quantite || 1),
                    0
                  );

                  return (
                    <tr key={commande.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{commande.clientId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(commande.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <ul className="list-disc list-inside space-y-1">
                          {commande.plats?.map((plat, idx) => (
                          

                            <li key={idx}>
                           {plat.nom} x {plat.quantite || 1} — {(plat.prix || 0) * (plat.quantite || 1)} €
                            
                            </li> 
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold text-gray-800">
                      {total.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => accepterCommande(commande)}
                          disabled={loadingId === commande.id}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
                        >
                          {loadingId === commande.id ? "Traitement..." : "Accepter"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
