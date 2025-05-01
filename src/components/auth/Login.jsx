import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    e.preventDefault();
    setError("");

    try {
      login({ email, password });

      console.log("Connexion réussie !");
    } catch (error) {
      setError("Échec de la connexion. Vérifiez vos identifiants.");
      console.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-2xl bg-gray-100 p-10 shadow-2xl">
        <h2 className="mb-8 text-center text-4xl font-extrabold text-neutral-900">
          Connexion
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-neutral-700">
              Email
            </label>
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
            <label className="mb-1 block text-sm font-semibold text-neutral-700">
              Mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-gray-300 bg-white p-4 pr-10 text-neutral-900 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-400 hover:text-black"
            >
              {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}

            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-black p-4 font-bold text-white transition hover:bg-neutral-800"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-8 flex justify-between text-sm text-gray-500">
          <a href="#" className="transition hover:text-black">
            Mot de passe oublié ?
          </a>
          <a href="/register" className="transition hover:text-black">
            Créer un compte
          </a>
        </div>
      </div>
    </div>
  );
}
