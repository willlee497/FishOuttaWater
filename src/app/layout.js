// layout.js
import FishFooter from '../components/FishFooter';
import localFont from 'next/font/local';
import './globals.css';
import Header from '../components/Header';
import Head from 'next/head';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata = {
    title: 'Fish Outta Water',
    description: 'We Help You Fish The Invasive Fishes Near You!',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
                <Header />
                <main className="flex-grow">{children}</main>
                <FishFooter />
            </body>
        </html>
    );
}
