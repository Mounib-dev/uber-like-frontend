import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:3000/gateway/client-service/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Échec de la connexion.");
      }
  
      console.log("Connexion réussie !");
  
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-2xl bg-gray-100 p-10 shadow-2xl">
        <h2 className="mb-8 text-4xl font-extrabold text-center text-neutral-900">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 bg-white p-4 text-neutral-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              placeholder="ex: utilisateur@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-gray-300 bg-white p-4 text-neutral-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black pr-10"
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
            Se connecter
          </button>
        </form>

        <div className="mt-8 flex justify-between text-sm text-gray-500">
          <a href="#" className="hover:text-black transition">Mot de passe oublié ?</a>
          <a href="/register" className="hover:text-black transition">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}
