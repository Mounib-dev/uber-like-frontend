import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../socketConfig";
import { useAuth } from "../../context/AuthContext";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

import api from "../../axiosConfig";

export default function DeliveryList() {
  const { userId } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [position, setPosition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommandeId, setSelectedCommandeId] = useState(null);

  useEffect(() => {
    socket.emit("register delivery person", userId); // passe le userId du client connecté

    socket.on("inform livreur about new accepted commande", (data) => {
      console.log("🍽️ Nouvelle commande :", data);
      const { commandeId } = data;

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeId ? { ...cmd, status: "en préparation" } : cmd,
        ),
      );

      toast.info("🍽️ Nouvelle commande à livrer !");
    });

    return () => {
      socket.off("inform client about preparation");
    };
  }, [userId, setCommandes]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_GATEWAY}/commande-service/list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

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

  const commandesAFournir = commandes.filter(
    (commande) =>
      commande.status === "en préparation" || commande.status === "prêt",
  );

  const requestGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos.coords);
          console.log("Position récupérée :", pos.coords);
        },
        (err) => {
          console.error("Erreur lors de la récupération de la position :", err);
          alert("Impossible de récupérer votre position.");
        },
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const handleLivrerClick = (commandeId) => {
    setSelectedCommandeId(commandeId);
    setShowModal(true);
  };

  const confirmLivraison = () => {
    requestGeolocation();
    setShowModal(false);
    setSelectedCommandeId(null);
  };

  const cancelLivraison = () => {
    setShowModal(false);
    setSelectedCommandeId(null);
  };

  return (
    <>
      <div className="relative mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Commandes à livrer
        </h1>

        {commandesAFournir.length === 0 ? (
          <p className="text-gray-500">Aucune commande à livrer.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Client
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commandesAFournir
                  .slice()
                  .reverse()
                  .map((commande, index) => {
                    const total = commande.plats?.reduce(
                      (sum, plat) =>
                        sum + (plat.prix || 0) * (plat.quantite || 1),
                      0,
                    );

                    return (
                      <tr
                        key={commande.id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {commande.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {commande.clientId}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          <ul className="list-inside list-disc space-y-1">
                            {commande.plats?.map((plat, idx) => (
                              <li key={idx}>
                                {plat.nom} x {plat.quantite || 1} —{" "}
                                {(plat.prix || 0) * (plat.quantite || 1)} €
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                          {total.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                          <div className="relative inline-flex items-center space-x-2">
                            <span className="flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                            </span>
                            <span>
                              {commande.status === "prêt"
                                ? "Prête"
                                : `${commande.status}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {(commande.status === "prêt" ||
                            commande.status === "en préparation") && (
                            <button
                              onClick={() => handleLivrerClick(commande.id)}
                              disabled={commande.status !== "prêt"}
                              className="rounded-lg bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                            >
                              Livrer
                            </button>
                          )}
                          {commande.status === "en cours de livraison" && (
                            <button
                              onClick={() => handleLivrerClick(commande.id)}
                              className="rounded-lg bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600"
                            >
                              Terminer
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(commande.date).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL DE CONFIRMATION */}
        {showModal && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
            <div className="pointer-events-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Confirmation
              </h2>
              <p className="mb-6 text-gray-600">
                Êtes-vous sûr de vouloir livrer cette commande ? En acceptant,
                vous partagez votre position actuelle.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelLivraison}
                  className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmLivraison}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
