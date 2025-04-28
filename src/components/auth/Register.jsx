import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      console.log("Enregistrement réussi !");
    } catch (error) {
      setError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr via-pink-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-black-600">Créer un compte</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-black-500 focus:ring-black-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-black-700">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-black-500 focus:ring-black-500 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-black-700">Confirmer le mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-black-500 focus:ring-black-500 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-black-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a href="/login" className="text-black-500 hover:underline">Déjà inscrit ? Se connecter</a>
        </div>
      </div>
    </div>
  );
}
