'use client';
import ParallaxFishes from '../components/ParallaxFishes';
import CanvasRevealEffect from '../components/RevealFish';
import CardHoverEffect from '../components/CardHover';
import ThreeDCard from '../components/ThreeDCard';
import Bubbles from '../components/Bubbles';

export default function Home() {
    return (
        <div className="relative overflow-hidden bg-blue-100">
            <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
                <Bubbles />
            </div>

            <div className="relative z-10 flex items-center justify-center mt-10">
                <div className="bg-white bg-opacity-80 p-8 rounded-lg duration-300 shadow-lg z-20 mt-10 hover:shadow-2xl">
                    <h1 className="text-4xl font-bold text-center text-blue-600">
                        Fish Outta Water
                    </h1>
                    <p className="text-lg text-center text-gray-800 font-bold">
                        Welcome to the wild world of fishy invaders!
                    </p>
                </div>
            </div>

            <div className="relative z-10 my-20">
                <ParallaxFishes />
            </div>

            <div className="relative flex items-center justify-center z-10">
                <div className="bg-white bg-opacity-80 p-8 rounded-lg mb-14 shadow-lg hover:shadow-2xl duration-300">
                    <h1 className="text-4xl font-bold text-center text-blue-600">
                        Our Message
                    </h1>
                    <div className="w-full max-w-4xl mx-auto">
                        <p className="text-lg text-center text-gray-800 font-bold">
                            Hey, we are Fish Outta Water! We are a team of
                            undergraduate college students working hard to bring
                            light to the problem of non-indigenous aquatic
                            species that are disrupting the environment for our
                            native ecosystems. Our mission is to shine a light
                            on a productive way of fishing that not only
                            benefits our environment, but also fills your tummy!
                        </p>
                    </div>
                </div>
            </div>

            <ul className="flex flex-row justify-center z-20">
                <li className="m-8 shadow-lg hover:shadow-2xl duration-300">
                    <CanvasRevealEffect
                        imagePath="/images/goldfish.jpg"
                        revealText="Goldfish"
                    />
                </li>
                <li className="m-8 shadow-lg hover:shadow-2xl duration-300">
                    <CanvasRevealEffect
                        imagePath="/images/clownfish.jpg"
                        revealText="Clownfish"
                    />
                </li>
            </ul>

            <div className="relative z-10">
                <CardHoverEffect />
                <ThreeDCard />
            </div>
        </div>
    );
}
