import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {useAuth} from '../../context/AuthContext'
import { useNavigate } from "react-router-dom";


export default function Panier({ panier, setPanier, commandes, setCommandes }) {
  const navigate  = useNavigate()
  const {userId }= useAuth ()
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
        }
      );
      console.log("🧾 Données reçues depuis le backend :", retrieveResponse.data);

      const allCommandes = Array.isArray(retrieveResponse.data)
      ? retrieveResponse.data
     : retrieveResponse.data.commandes || [];

  
      const commandesUtilisateur = allCommandes.filter(
        (cmd) => cmd.clientId === parseInt(userId)
      );
  
      const hasPending = commandesUtilisateur.some(
        (cmd) => cmd.status === "en attente"
      );
  
      if (hasPending) {
        alert("⚠️ Vous avez déjà une commande en attente !");
        return;
      }
  
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY}/commande-service/create`,
        {
          clientId: parseInt(userId),
          plats: panier,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Commande enregistrée :", response.data);
  
      setCommandes((prev) => [...prev, nouvelleCommande]);
      setPanier([]);
      navigate("/commandes");
    } catch (error) {
      console.error("Erreur lors de la commande :", error);
      alert("❌ La commande n'a pas pu être enregistrée.");
    }
  };
  
  

  const total = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0);

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
                <img src={item.image} alt={item.nom} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 ml-4">
                  <h2 className="font-semibold text-lg">{item.nom}</h2>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="mt-1 font-medium">{item.prix} €</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => diminuerQuantite(index)}
                    className="bg-red-500 text-white w-8 h-8 rounded-full"
                  >
                    −
                  </button>
                  <span>{item.quantite}</span>
                  <button
                    onClick={() => augmenterQuantite(index)}
                    className="bg-green-500 text-white w-8 h-8 rounded-full"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => supprimerProduit(index)} className="text-red-600 text-xl ml-4">
                    🗑️
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

      

   
    </div>
  );
}
