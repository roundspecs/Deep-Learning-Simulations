import Link from "next/link";

export default function Home() {
  const simulations = [
    {
      id: "perceptron",
      title: "Perceptron",
      description: "Simple perceptron visualizer — inputs, weights and learning",
      href: "/perceptron",
    },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-3xl w-full p-8">
        <h1 className="text-3xl font-bold mb-4">Simulations</h1>
        <p className="text-gray-600 mb-6">A collection of small interactive simulations. Click any tile to open the simulation.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {simulations.map(sim => (
            <Link key={sim.id} href={sim.href} className="block p-4 border rounded-lg hover:shadow-md transition">
              <h2 className="font-semibold">{sim.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{sim.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
