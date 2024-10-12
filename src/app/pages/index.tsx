import Head from 'next/head';
import dynamic from 'next/dynamic';

const InvasiveFishMap = dynamic(() => import('../src/app/components/InvasiveFishMap'), {
  ssr: false,
});



export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Invasive Fish Map</title>
        <meta name="description" content="Map of invasive fish species" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Invasive Fish Map</h1>
        <InvasiveFishMap />
      </main>
    </div>
  );
}
