import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../socketConfig";
import { useAuth } from "../../context/AuthContext";
import api from "../../axiosConfig";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

export default function ChefList() {
  const { userId } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
  const [popupContent, setPopupContent] = useState("");

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_GATEWAY}/commande-service/list`,
          {
            headers: {
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

  useEffect(() => {
    socket.emit("register chef", userId);

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

    socket.on("inform restaurant", async (data) => {
      console.log("🍽️ Nouvelle commande :", data);
      const { commandeId, clientId, plats } = data;
      const client = await fetchClient(clientId);
      setCommandes((prevCommandes) => [
        ...prevCommandes,
        {
          id: commandeId,
          plats: plats,
          status: "en attente",
          clientInfo: client[0],
        },
      ]);

      toast.info("🍽️ Nouvelle commande à préparer !");
    });

    socket.on("inform restaurant delivery started", (data) => {
      const { commandeId } = data;
      console.log(
        `🛵 La commande ${commandeId} est en cours de livraison !`,
        data,
      );

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeId
            ? { ...cmd, status: "en cours de livraison" }
            : cmd,
        ),
      );

      toast.info(`🛵 La commande ${commandeId} est en cours de livraison !`);
    });

    socket.on("inform restaurant order delivered", (data) => {
      const { commandeId } = data;
      console.log(`🛵 La commande ${commandeId} a été livrée !`, data);

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeId ? { ...cmd, status: "livré" } : cmd,
        ),
      );

      toast.info(`🛵 La commande ${commandeId} a été livrée !`);
    });

    return () => {
      socket.off("inform restaurant");
      socket.off("inform restaurant delivery started");
      socket.off("inform restaurant order delivered");
    };
  }, [userId]);

  const processOrder = async (commande, newStatus) => {
    try {
      setLoadingId(commande.id);
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
        console.log("NEW STATUS: ", newStatus);
        if (newStatus === "en préparation") {
          socket.emit("accept order", { commandeId, clientId, plats });
        } else if (newStatus === "prêt") {
          socket.emit("order is ready", { commandeId, clientId });
        }
      }
      const updatedCommandes = commandes.map((cmd) =>
        cmd.id === commande.id ? { ...cmd, status: newStatus } : cmd,
      );

      setCommandes(updatedCommandes);
      // alert("Commande acceptée, le client a été informé.");
      if (newStatus === "en préparation") {
        setPopupHeader("Commande acceptée");
        setPopupContent("Commande acceptée, client informé.");
      } else if (newStatus === "prêt") {
        setPopupHeader("Commande prête");
        setPopupContent("Commande prête, client informé.");
      }
      setShowPopup(true);
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
      alert("Impossible de changer le statut.");
    } finally {
      setLoadingId(null);
    }
  };

  // const commandesEnAttente = commandes.filter(
  //   (commande) => commande.status === "en attente",
  // );

  return (
    <>
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Commandes des clients
        </h1>
        {commandes.length === 0 ? (
          <p className="text-gray-500">Aucune commande</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Total
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

                    return (
                      <tr
                        key={commande.id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {commande.clientInfo?.firstName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span>
                            {commande.status === "prêt"
                              ? "Prête"
                              : commande.status === "livré"
                                ? "Livrée"
                                : commande.status}
                          </span>
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
                        <td className="px-6 py-4 text-center">
                          {commande.status === "en attente" && (
                            <button
                              onClick={() =>
                                processOrder(commande, "en préparation")
                              }
                              disabled={loadingId === commande.id}
                              className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 disabled:opacity-50"
                            >
                              {loadingId === commande.id
                                ? "Traitement..."
                                : "Accepter"}
                            </button>
                          )}
                          {commande.status === "en préparation" && (
                            <button
                              onClick={() => processOrder(commande, "prêt")}
                              disabled={loadingId === commande.id}
                              className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 disabled:opacity-50"
                            >
                              {loadingId === commande.id
                                ? "Traitement..."
                                : "Prête"}
                            </button>
                          )}
                          {(commande.status === "en cours de livraison" ||
                            commande.status === "livré") && <span>N/C</span>}
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
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">{popupHeader}</h2>
            <p className="mb-4 text-gray-700">{popupContent}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
