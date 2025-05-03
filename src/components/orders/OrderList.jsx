import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { socket } from "../../socketConfig";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

import api from "../../axiosConfig";

export default function OrderList({ commandes, setCommandes }) {
  const { userId } = useAuth();
  const [commandeEnCours, setCommandeEnCours] = useState(null);
  const [ongletActif, setOngletActif] = useState("enCours");
  const [showModal, setShowModal] = useState(false);
  const [commandeASupprimer, setCommandeASupprimer] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showThanksPopup, setShowThanksPopup] = useState(false);

  useEffect(() => {
    socket.emit("register", userId); // passe le userId du client connecté

    socket.on("inform client about preparation", (data) => {
      console.log("🍽️ Commande en préparation :", data);
      const { commandeId } = data;

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeId ? { ...cmd, status: "en préparation" } : cmd,
        ),
      );

      toast.info("🍽️ Votre commande est en cours de préparation !");
    });

    socket.on("inform client order is ready", (data) => {
      console.log("🍽️ Votre commande est prête :", data);
      const { commandeId } = data;

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeId ? { ...cmd, status: "prêt" } : cmd,
        ),
      );

      toast.info("🍽️ Votre commande est prête à être livrée !");
    });

    socket.on("inform client delivery started", (data) => {
      console.log("🍽️ Votre commande est en cours de livraison :", data);
      const { commandeId } = data;

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeId
            ? { ...cmd, status: "en cours de livraison" }
            : cmd,
        ),
      );

      toast.info("🛵 Votre commande est en cours de livraison !");
    });

    socket.on("inform client order delivered", (data) => {
      console.log("Merci d'avoir commandé !");
      const { commandeId } = data;

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeId ? { ...cmd, status: "livré" } : cmd,
        ),
      );

      setShowThanksPopup(true);
    });

    return () => {
      socket.off("inform client about preparation");
      socket.off("inform client order is ready");
      socket.off("inform client delivery started");
      socket.off("inform client order delivered");
    };
  }, [userId, setCommandes]);

  // const getStatusStyle = (status) => {
  //   switch (status) {
  //     case "en attente":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "en préparation":
  //       return "bg-orange-100 text-orange-800";
  //     case "en cours de livraison":
  //       return "bg-blue-100 text-blue-800";
  //     case "livrée":
  //       return "bg-green-100 text-green-700";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

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
      ? commandes.filter((cmd) => cmd.status !== "livrée")
      : commandes.filter((cmd) => cmd.status === "livrée");

  const openModal = (commandeId) => {
    setCommandeASupprimer(commandeId);
    setShowModal(true);
  };

  const confirmAnnulation = async () => {
    const commandeAAnnuler = commandes.find(
      (cmd) => cmd.id === commandeASupprimer,
    );
    if (!commandeAAnnuler) return;

    try {
      setCommandeEnCours(commandeASupprimer);
      await axios.delete(
        `${import.meta.env.VITE_API_GATEWAY}/commande-service/${commandeAAnnuler.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedCommandes = commandes.filter(
        (cmd) => cmd.id !== commandeAAnnuler.id,
      );
      setCommandes(updatedCommandes);
      localStorage.setItem("commandes", JSON.stringify(updatedCommandes));

      setToastMessage("Commande annulée avec succès !");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      alert("Impossible d'annuler la commande.");
    } finally {
      setCommandeEnCours(null);
      setShowModal(false);
      setCommandeASupprimer(null);
    }
  };

  const cancelAnnulation = () => {
    setShowModal(false);
    setCommandeASupprimer(null);
  };

  return (
    <>
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold text-neutral-800 md:text-3xl">
          Mes Commandes
        </h1>

        <div className="mb-6 flex space-x-2">
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              ongletActif === "enCours"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setOngletActif("enCours")}
          >
            En cours
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
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
            <table className="min-w-full divide-y divide-gray-100 overflow-hidden rounded-lg bg-white shadow-sm">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  {/* <th className="px-6 py-4 font-medium">Date</th> */}
                  <th className="px-6 py-4 font-medium">Articles</th>
                  <th className="px-6 py-4 text-right font-medium">Total</th>
                  <th className="px-6 py-4 text-right font-medium">Status</th>
                  <th className="px-6 py-4 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {commandesFiltrees
                  .slice()
                  .reverse()
                  .map((commande) => {
                    const total = commande.plats?.reduce(
                      (sum, plat) =>
                        sum + (plat.prix || 0) * (plat.quantite || 1),
                      0,
                    );

                    return (
                      <tr key={commande.id} className="hover:bg-gray-50">
                        {/* <td className="px-6 py-4 text-gray-800">
                          {new Date(commande.date).toLocaleString()}
                        </td> */}
                        <td className="px-6 py-4 text-gray-700">
                          <ul className="list-inside list-disc space-y-1">
                            {commande.plats?.map((plat, idx) => (
                              <li key={idx}>
                                {plat.nom} x {plat.quantite || 1} —{" "}
                                {(plat.prix || 0) * (plat.quantite || 1)} €
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          {typeof total === "number"
                            ? total.toFixed(2)
                            : "0.00"}{" "}
                          €
                        </td>
                        <td className="px-6 py-4 text-right">
                          {commande.status !== "livrée" && (
                            <div className="relative inline-flex items-center space-x-2">
                              <span className="flex h-3 w-3">
                                {commande.status !== "livré" && (
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                )}
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                              </span>
                              <span>
                                {commande.status === "prêt"
                                  ? "Prête"
                                  : commande.status === "livré"
                                    ? "Livrée"
                                    : commande.status}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {commande.status !== "livré" ? (
                            <button
                              onClick={() => openModal(commande.id)}
                              disabled={commandeEnCours === commande.id}
                              className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              {commandeEnCours === commande.id
                                ? "Annulation..."
                                : "Annuler"}
                            </button>
                          ) : (
                            <span>N/C</span>
                          )}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="animate-fade-in w-full max-w-md scale-100 transform rounded-xl bg-white p-6 opacity-100 shadow-2xl transition-all">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Confirmer l'annulation
              </h2>
              <p className="mb-6 text-gray-600">
                Êtes-vous sûr de vouloir annuler cette commande ? Cette action
                est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelAnnulation}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Retour
                </button>
                <button
                  onClick={confirmAnnulation}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {showThanksPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-bold">Merci !</h2>
              <p className="mb-4 text-gray-700">
                Merci d'avoir commandé, nous espérons vous revoir bientôt !
              </p>
              <button
                onClick={() => setShowThanksPopup(false)}
                className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* TOAST DE SUCCÈS */}
        {toastMessage && (
          <div className="animate-fade-in fixed right-6 bottom-6 z-50 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
