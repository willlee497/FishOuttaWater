import Link from 'next/link';

export default function Header() {
    return (
        <header className="group relative bg-white shadow-md transition-colors duration-300 hover:bg-blue-400">
            <div className="absolute inset-0 bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300"
                    >
                        Fucked Up Fishes
                    </Link>
                    <nav className="flex space-x-4 sm:space-x-8">
                        <Link
                            href="/"
                            className="text-base font-medium text-gray-500 hover:text-gray-900 group-hover:text-white transition-colors duration-300"
                        >
                            Home
                        </Link>
                        <Link
                            href="/map"
                            className="text-base font-medium text-gray-500 hover:text-gray-900 group-hover:text-white transition-colors duration-300"
                        >
                            Map
                        </Link>
                        <Link
                            href="/recipes"
                            className="text-base font-medium text-gray-500 hover:text-gray-900 group-hover:text-white transition-colors duration-300"
                        >
                            Recipes
                        </Link>
                        <Link
                            href="/social-media"
                            className="text-base font-medium text-gray-500 hover:text-gray-900 group-hover:text-white transition-colors duration-300"
                        >
                            Social Media
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
