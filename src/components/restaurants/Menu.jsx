export default function Menu({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-6">{item.description}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{item.price} €</span>
            <button className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
              Commander
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
