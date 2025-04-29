import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const phoneRegex = /^0[1-9](\s\d{2}){4}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneRegex.test(phoneNumber)) {
      setError("Le numéro de téléphone doit être au format : 06 00 00 00 00");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/gateway/client-service/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          address,
          phoneNumber,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription.");
      }

      console.log("Inscription réussie !");
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-2xl bg-gray-100 p-10 shadow-2xl">
        <h2 className="mb-8 text-4xl font-extrabold text-center text-neutral-900">Créer un compte</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Prénom</label>
            <input
              type="text"
              className="w-full rounded-lg border bg-white p-4"
              placeholder="prenom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Nom</label>
            <input
              type="text"
              className="w-full rounded-lg border bg-white p-4"
              placeholder="nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border bg-white p-4"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Adresse</label>
            <input
              type="text"
              className="w-full rounded-lg border bg-white p-4"
              placeholder="Votre adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Numéro de téléphone</label>
            <input
              type="text"
              className="w-full rounded-lg border bg-white p-4"
              placeholder="ex: 06 00 00 00 00"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border bg-white p-4 pr-10"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-black text-white font-bold p-4 hover:bg-neutral-800 transition"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <a href="/login" className="hover:text-black transition">Déjà inscrit ? Se connecter</a>
        </div>
      </div>
    </div>
  );
}
