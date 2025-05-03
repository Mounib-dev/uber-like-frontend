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

  const [nextOrderStatus, setNextOrderStatus] = useState("");

  useEffect(() => {
    socket.emit("register delivery person", userId); // passe le userId du client connecté

    const fetchClient = async (clientId) => {
      const clientsResponse = await axios.get(
        `${import.meta.env.VITE_API_GATEWAY}/client-service/clients`,
        {
          params: { ids: clientId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );
      return clientsResponse.data.clients;
    };

    socket.on("inform livreur about new accepted commande", async (data) => {
      console.log("🍽️ Nouvelle commande :", data);
      const { commandeId, clientId, plats } = data;
      const client = await fetchClient(clientId);
      setCommandes((prevCommandes) => [
        ...prevCommandes,
        {
          id: commandeId,
          plats: plats,
          status: "en préparation",
          clientInfo: client[0],
        },
      ]);

      toast.info("🍽️ Nouvelle commande en préparation !");
    });

    socket.on("inform livreur order is ready", (data) => {
      console.log("🍽️ Nouvelle commande :", data);
      const { commandeId } = data;

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeId ? { ...cmd, status: "prêt" } : cmd,
        ),
      );

      toast.info(`🍽️ Commande ${commandeId} prête à être livrée !`);
    });

    return () => {
      socket.off("inform livreur about new accepted commande");
      socket.off("inform livreur order is ready");
    };
  }, [userId]);

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

        const clientIds = [...new Set(allCommandes.map((c) => c.clientId))];

        const clientsResponse = await axios.get(
          `${import.meta.env.VITE_API_GATEWAY}/client-service/clients`,
          {
            params: { ids: clientIds.join(",") },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        const rawClientsData = clientsResponse.data.clients;

        const clientsData = Array.isArray(rawClientsData)
          ? rawClientsData
          : [rawClientsData];

        const commandesWithClients = allCommandes.map((cmd) => {
          const client = clientsData.find((c) => c.id === cmd.clientId);
          return {
            ...cmd,
            clientInfo: client || null,
          };
        });

        console.log(commandesWithClients);
        setCommandes(commandesWithClients);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    };

    fetchCommandes();
  }, []);

  // const commandesAFournir = commandes.filter(
  //   (commande) =>
  //     commande.status === "en préparation" || commande.status === "prêt",
  // );

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

  const handleLivrerClick = (commandeId, newStatus) => {
    setSelectedCommandeId(commandeId);
    setNextOrderStatus(newStatus);
    setShowModal(true);
  };

  const confirmLivraison = async (commande, newStatus) => {
    // requestGeolocation();
    setShowModal(false);
    setSelectedCommandeId(null);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_GATEWAY}/commande-service/update`,
        {
          id: commande.id,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const clientId = `${response.data.commande.clientId}`;
        const commandeId = commande.id;
        const plats = response.data.commande.plats;
        console.log("Client ID: ", clientId);
        console.log("Commande ID: ", commandeId);
        if (newStatus === "en cours de livraison") {
          socket.emit("start delivery", { commandeId, clientId, plats });
        } else if (newStatus === "livré") {
          socket.emit("order delivered", { commandeId, clientId });
        }
      }
      const updatedCommandes = commandes.map((cmd) =>
        cmd.id === commande.id ? { ...cmd, status: newStatus } : cmd,
      );

      setCommandes(updatedCommandes);
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
    }
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

        {commandes.length === 0 ? (
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
                  {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Date
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commandes
                  .slice()
                  .reverse()
                  .map((commande, index) => {
                    const total = commande.plats?.reduce(
                      (sum, plat) =>
                        sum + (plat.prix || 0) * (plat.quantite || 1),
                      0,
                    );
                    {
                      /* MODAL DE CONFIRMATION */
                    }
                    {
                      showModal && (
                        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
                          <div className="pointer-events-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">
                              Confirmation
                            </h2>
                            <p className="mb-6 text-gray-600">
                              Êtes-vous sûr de vouloir livrer cette commande ?
                              En acceptant, vous partagez votre position
                              actuelle.
                            </p>
                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={cancelLivraison}
                                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={confirmLivraison(
                                  commande,
                                  nextOrderStatus,
                                )}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                              >
                                Confirmer
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <tr
                        key={commande.id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {commande.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {commande.clientInfo.firstName}
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
                              {commande.status !== "livré" && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                              )}
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                            </span>
                            <span>
                              {commande.status === "prêt"
                                ? "Prête"
                                : commande.status === "livré"
                                  ? "Livrée"
                                  : commande.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {(commande.status === "prêt" ||
                            commande.status === "en préparation") && (
                            <button
                              onClick={() =>
                                handleLivrerClick(
                                  commande.id,
                                  "en cours de livraison",
                                )
                              }
                              disabled={commande.status !== "prêt"}
                              className="rounded-lg bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                            >
                              Livrer
                            </button>
                          )}
                          {commande.status === "en cours de livraison" && (
                            <button
                              onClick={() =>
                                handleLivrerClick(commande.id, "livré")
                              }
                              className="rounded-lg bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600"
                            >
                              Terminer
                            </button>
                          )}
                        </td>
                        {/* <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(commande.date).toLocaleString()}
                        </td> */}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
