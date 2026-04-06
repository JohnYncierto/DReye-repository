export default function Navbar() {


    return (
        <nav className="bg-blue-800 text-white px-6 py-4 shadow flex justify-between">
            <h1 className="text-2xl font-bold text-white">DR Screening System</h1>
            <div className="space-x-4 text-sm">
                <a href="#" className="hover:text-gray-300">Dashboard</a>
                <a href="#" className="hover:text-gray-300">Results</a>
            </div>
        </nav>

    );
}
