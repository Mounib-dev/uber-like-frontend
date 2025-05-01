import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function OrderList({ commandes, setCommandes }) {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ongletActif, setOngletActif] = useState("enCours");
  
  const getStatusStyle = (status) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "en cours de préparation":
        return "bg-orange-100 text-orange-800";
      case "en cours de livraison":
        return "bg-blue-100 text-blue-800";
      case "livrée":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
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

        const allCommandes = Array.isArray(response.data)
          ? response.data
          : response.data.commandes || [];

        const commandesUtilisateur = allCommandes
          .filter((cmd) => cmd.clientId === parseInt(userId))
          .map((cmd) => ({
            ...cmd,
            date: cmd.date || new Date().toISOString(),
          }));

        setCommandes(commandesUtilisateur);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    };
fetchCommandes();
  }, [userId]);

const commandesFiltrees =
  ongletActif === "enCours"
    ? commandes.filter((cmd) => cmd.status !== "livré")
    : commandes.filter((cmd) => cmd.status === "livré"); 

  const annulerDerniereCommande = async () => {
    const commandesEnCours = commandes.filter((cmd) => cmd.status === "en attente");
    if (commandesEnCours.length === 0) return;
    const derniereCommande = commandesEnCours[commandesEnCours.length - 1];

    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_GATEWAY}/commande-service/delete`, {
        data: {
          clientId: parseInt(userId),
          date: derniereCommande.date,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const updatedCommandes = commandes.filter(
        (cmd) => !(cmd.date === derniereCommande.date && cmd.status === "en attente")
      );
      setCommandes(updatedCommandes);
      localStorage.setItem("commandes", JSON.stringify(updatedCommandes));

      alert("Commande annulée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      alert("Impossible d'annuler la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-800">Mes Commandes</h1>

      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            ongletActif === "enCours"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setOngletActif("enCours")}
        >
          En cours
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            ongletActif === "historique"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setOngletActif("historique")}
        >
          Historique
        </button>
      </div>

      {commandesFiltrees.length === 0 ? (
        <p className="text-gray-500">Aucune commande dans cet onglet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 shadow-sm rounded-lg overflow-hidden bg-white">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Articles</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {commandesFiltrees
                .slice()
                .reverse()
                .map((commande, index) => {
                  const isLatest =
                    ongletActif === "enCours" && index === 0;
                  const total = commande.plats?.reduce(
                    (sum, plat) => sum + (plat.prix || 0) * (plat.quantite || 1),
                    0
                  );

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">
                        {new Date(commande.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <ul className="list-disc list-inside space-y-1">
                          {commande.plats?.map((plat, idx) => (
                            <li key={idx}>
                              {plat.nom} x {plat.quantite || 1} — {(plat.prix || 0) * (plat.quantite || 1)} €
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {typeof total === "number" ? total.toFixed(2) : "0.00"} €

                      </td>
                      <td className="px-6 py-4 text-right">
                     <div className="relative inline-flex items-center">
                     <span className={`relative z-10 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(commande.status)}`}>
                             {commande.status}
                     </span>
                      {commande.status !== "livrée" && (
                          <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75 animate-ping"></span>
                        )}
                      </div>

                      </td>
                      <td className="px-6 py-4 text-center">
                        {isLatest && (
                          <button
                            onClick={annulerDerniereCommande}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                          >
                            {loading ? "Annulation..." : "Annuler"}
                          </button>
                        )}
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
