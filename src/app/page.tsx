import Link from "next/link";

export default function Home() {
  return (
    <main>
         <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="max-w-md p-8 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Bienvenue sur ChatSphere</h1>
            <p className="text-gray-700 mb-6">ChatSphere est une plateforme de communication en temps réel où vous pouvez rejoindre des salles de chat et discuter avec d'autres utilisateurs instantanément.</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <Link href="/room">Rejoindre la salle de chat</Link>
            </button>
          </div>
        </div>
    </main>
  );
}
