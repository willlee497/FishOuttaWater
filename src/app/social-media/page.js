import React from 'react';

export default function SocialMedia() {
    const platforms = [
        { name: 'Twitter', icon: '🐦', color: 'bg-blue-400' },
        { name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
        { name: 'Facebook', icon: '👍', color: 'bg-blue-600' },
        { name: 'YouTube', icon: '🎥', color: 'bg-red-600' },
    ];

    const posts = [
        'Check out this three-eyed catfish we found!',
        'New recipe alert: Luminescent Lionfish Linguine',
        'Live stream: Exploring the Absurd Aquarium tonight at 8 PM',
        'Just spotted a fish with legs. Yes, you read that right!',
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                Fucked Up Fishies Social Media
            </h1>
            <div className="max-w-2xl mx-auto space-y-8">
                <p className="text-center text-lg mb-8 text-blue-800">
                    Connect with our community of fish enthusiasts and share
                    your own fucked up fishies experiences!
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {platforms.map((platform) => (
                        <a
                            key={platform.name}
                            href="#"
                            className={`flex items-center justify-center p-4 rounded-lg ${platform.color} text-white hover:opacity-90 transition-opacity`}
                        >
                            <span className="mr-2">{platform.icon}</span>
                            <span>{platform.name}</span>
                        </a>
                    ))}
                </div>
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                        Latest Posts
                    </h2>
                    <div className="space-y-4">
                        {posts.map((post, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow"
                            >
                                <p className="text-blue-700">{post}</p>
                                <div className="mt-2 text-sm text-blue-500">
                                    Posted {index + 1} hour
                                    {index !== 0 ? 's' : ''} ago
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
