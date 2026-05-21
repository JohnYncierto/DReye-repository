export default function Navbar({onLogout}) {


    return (
        <nav className="bg-blue-800 text-white px-6 py-4 shadow flex justify-between">
            <h1 className="text-2xl font-bold text-white">DR Screening System</h1>
            <div className="space-x-4 text-sm">
                <a href="#" className="hover:text-gray-300">Dashboard</a>
                <a href="#" className="hover:text-gray-300">Results</a>
            </div>

            <button
                onClick={onLogout}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-red-700 transition"
            >
                Logout
            </button>
        </nav>

    );
}
