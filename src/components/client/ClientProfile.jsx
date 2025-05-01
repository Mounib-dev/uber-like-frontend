export default function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user) {
      return (
        <div className="p-4 text-center text-gray-600">
          Aucune information utilisateur.
        </div>
      );
    }
  
    return (
      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl transition hover:shadow-2xl">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
             Mon Profil
          </h2>
          <ul className="space-y-4 text-sm text-gray-700">
            <li className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-500">Prénom :</span>
              <span>{user.firstName}</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-500">Nom :</span>
              <span>{user.lastName}</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-500">Email :</span>
              <span>{user.email}</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-500">Téléphone :</span>
              <span>{user.phoneNumber}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-gray-500">Adresse :</span>
              <span className="text-right">{user.address}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  