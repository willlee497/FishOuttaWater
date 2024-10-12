// components/BoxGrid.js
import { useEffect, useState, useRef } from 'react';

// Function to generate a set of box data
const generateBoxes = (start, count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: start + i,
        color: `hsl(${Math.random() * 360}, 100%, 75%)`, // Random color for each box
    }));
};

export default function BoxGrid() {
    const [boxes, setBoxes] = useState(generateBoxes(0, 20)); // Initial 20 boxes
    const [loading, setLoading] = useState(false);
    const observerRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setLoading(true);

                    // Simulate network request or delay
                    setTimeout(() => {
                        // Generate the next 20 boxes
                        const newBoxes = generateBoxes(boxes.length, 20);
                        setBoxes((prevBoxes) => [...prevBoxes, ...newBoxes]);
                        setLoading(false);
                    }, 1000);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 1.0, // Trigger when the sentinel is fully visible
            }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [boxes, loading]);

    return (
        <div className="flex flex-col items-center">
            {/* Render the boxes */}
            {boxes.map((box) => (
                <div
                    key={box.id}
                    className="box w-48 h-48 mb-4"
                    style={{ backgroundColor: box.color }}
                >
                    <p className="text-white text-center">Box {box.id}</p>
                </div>
            ))}

            {/* Sentinel (this triggers loading of more content when visible) */}
            <div ref={observerRef} className="sentinel w-full h-12"></div>

            {/* Optional: Loading indicator */}
            {loading && <p className="text-center">Loading...</p>}
        </div>
    );
}
