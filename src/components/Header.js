import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="group relative bg-blue-400 duration-300 hover:bg-blue-500 z-20 shadow-xlg hover:shadow-2xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <Link href="/">
                        <ul className="flex flex-row items-center justify-center">
                            <li>
                                <Image
                                    src={'/logo.webp'}
                                    alt="Website Logo"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                            </li>
                            <li className="ml-5">
                                {' '}
                                <h1 className="text-lg font-bold text-white">
                                    Fish Outta Water
                                </h1>
                            </li>
                        </ul>
                    </Link>
                    <nav className="flex space-x-4 sm:space-x-8">
                        <Link
                            href="/"
                            className="text-base font-bold font-large text-white hover:text-gray-300 transition-colors duration-300"
                        >
                            Home
                        </Link>
                        <Link
                            href="/map"
                            className="text-base font-bold font-large text-white hover:text-gray-300 transition-colors duration-300"
                        >
                            Map
                        </Link>
                        <Link
                            href="/recipes"
                            className="text-base font-bold font-large text-white hover:text-gray-300 transition-colors duration-300"
                        >
                            Recipes
                        </Link>
                        <Link
                            href="/social-media"
                            className="text-base font-bold font-large text-white hover:text-gray-300 transition-colors duration-300"
                        >
                            Social Media
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
