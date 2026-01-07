export default function Card({ title, count }) {
  return (
    <div className="bg-black border border-[#FFD700] rounded-xl p-6 shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <h3 className="text-[#FFD700] text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white text-4xl font-bold">{count}</p>
    </div>
  );
}
