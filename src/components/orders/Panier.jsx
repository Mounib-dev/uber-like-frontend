import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../axiosConfig";
import { socket } from "../../socketConfig";

export default function Panier({ panier, setPanier, commandes, setCommandes }) {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [indexASupprimer, setIndexASupprimer] = useState(null);

  const confirmerSuppression = () => {
    supprimerProduit(indexASupprimer);
    setIndexASupprimer(null);
  };

  useEffect(() => {
    const savedPanier = localStorage.getItem("panier");
    const savedCommandes = localStorage.getItem("commandes");

    try {
      if (savedPanier && savedPanier !== "undefined") {
        setPanier(JSON.parse(savedPanier));
      }
    } catch (e) {
      console.error("Erreur lors du parsing du panier :", e);
    }

    try {
      if (savedCommandes && savedCommandes !== "undefined") {
        setCommandes(JSON.parse(savedCommandes));
      }
    } catch (e) {
      console.error("Erreur lors du parsing des commandes :", e);
    }
  }, [setCommandes, setPanier]);

  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(panier));
  }, [panier]);

  useEffect(() => {
    localStorage.setItem("commandes", JSON.stringify(commandes));
  }, [commandes]);
  const [showHistorique, setShowHistorique] = useState(false);

  const augmenterQuantite = (index) => {
    const updated = [...panier];
    updated[index].quantite++;
    setPanier(updated);
  };

  const diminuerQuantite = (index) => {
    const updated = [...panier];
    if (updated[index].quantite > 1) {
      updated[index].quantite--;
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

  const commander = async () => {
    if (panier.length === 0) return;

    const nouvelleCommande = {
      items: panier,
      date: new Date().toISOString(),
    };

    try {
      const retrieveResponse = await axios.get(
        `${import.meta.env.VITE_API_GATEWAY}/commande-service/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(
        "🧾 Données reçues depuis le backend :",
        retrieveResponse.data,
      );

      const allCommandes = Array.isArray(retrieveResponse.data)
        ? retrieveResponse.data
        : retrieveResponse.data.commandes || [];

      const commandesUtilisateur = allCommandes.filter(
        (cmd) => cmd.clientId === parseInt(userId),
      );

      const hasPending = commandesUtilisateur.some(
        (cmd) => cmd.status === "en attente",
      );

      if (hasPending) {
        setShowPopup(true);

        return;
      }

      const response = await api.post(
        `${import.meta.env.VITE_API_GATEWAY}/commande-service/create`,
        {
          clientId: parseInt(userId),
          plats: panier,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Commande enregistrée :", response.data);

      setCommandes((prev) => [...prev, nouvelleCommande]);
      setPanier([]);
      if (response.status === 201) {
        console.log(response.data);
        const commandeId = response.data.commande.id;
        const clientId = userId;
        socket.emit("inform restaurant about new commande", {
          commandeId,
          clientId,
          plats: panier,
        });
      }
      navigate("/commandes");
    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      alert("❌ La commande n'a pas pu être enregistrée.");
    }
  };

  const total = panier.reduce(
    (acc, item) => acc + item.prix * item.quantite,
    0,
  );

  return (
    <div className="min-h-screen bg-white p-6 text-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Votre panier</h1>

      {panier.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <>
          <div className="space-y-6">
            {panier.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow"
              >
                <img
                  src={item.image}
                  alt={item.nom}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-semibold">{item.nom}</h2>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="mt-1 font-medium">{item.prix} €</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => diminuerQuantite(index)}
                    className="h-8 w-8 rounded-full bg-red-500 text-white"
                  >
                    −
                  </button>
                  <span>{item.quantite}</span>
                  <button
                    onClick={() => augmenterQuantite(index)}
                    className="h-8 w-8 rounded-full bg-green-500 text-white"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => setIndexASupprimer(index)}
                  className="ml-4 text-xl text-red-600"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right text-xl font-bold text-black">
            Total : {total} €
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={commander}
              className="rounded-lg bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
            >
              Passer la commande
            </button>
          </div>
        </>
      )}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Commande en attente</h2>
            <p className="mb-4 text-gray-700">
              ⚠️ Vous avez déjà une commande en attente. Merci de patienter
              avant de passer une nouvelle commande.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      {indexASupprimer !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-80 rounded-2xl bg-white p-6 text-center shadow-lg">
            <p className="mb-4 text-lg text-gray-800">
              Confirmer la suppression ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmerSuppression}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Supprimer
              </button>
              <button
                onClick={() => setIndexASupprimer(null)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
