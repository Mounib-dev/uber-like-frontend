import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function OrderList({ commandes, setCommandes }) {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);

  const accepterCommande = async (commande) => {
    try {
      setLoading(true);
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
      localStorage.setItem("commandes", JSON.stringify(updatedCommandes));
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
      alert("Impossible de changer le statut.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les commandes dont le statut est "en attente"
  const commandesEnAttente = commandes.filter((commande) => commande.status === "en attente");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Commandes en attente</h1>
      {commandesEnAttente.length === 0 ? (
        <p className="text-gray-500">Aucune commande en attente.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Articles</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Total</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {commandesEnAttente
                .slice()
                .reverse()
                .map((commande, index) => {
                  const total = commande.items.reduce(
                    (sum, item) => sum + item.prix * item.quantite,
                    0
                  );

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(commande.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <ul className="list-disc list-inside space-y-1">
                          {commande.items.map((item, idx) => (
                            <li key={idx}>
                              {item.nom} x {item.quantite} — {item.prix * item.quantite} €
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold text-gray-800">
                        {total.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-700">
                        {commande.status}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => accepterCommande(commande)}
                          disabled={loading}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
                        >
                          {loading ? "Traitement..." : "Accepter"}
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
