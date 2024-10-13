'use client'

import React, { useState } from 'react'

export default function SocialMedia() {
    const [post, setPost] = useState('')
    const [selectedPlatforms, setSelectedPlatforms] = useState([])
    const [file, setFile] = useState(null)

    const platforms = [
        { name: 'Twitter', icon: '🐦', color: 'bg-blue-400', uploadUrl: 'https://twitter.com/compose/tweet' },
        { name: 'YouTube', icon: '🎥', color: 'bg-red-600', uploadUrl: 'https://www.youtube.com/upload' },
        { name: 'Facebook', icon: '👍', color: 'bg-blue-600', uploadUrl: 'https://www.facebook.com/' },
        { name: 'Instagram', icon: '📷', color: 'bg-pink-500', uploadUrl: 'https://www.instagram.com/' },
    ]

    const posts = [
        'Check out this three-eyed catfish we found!',
        'New recipe alert: Luminescent Lionfish Linguine',
        'Live stream: Exploring the Absurd Aquarium tonight at 8 PM',
        'Just spotted a fish with legs. Yes, you read that right!',
    ]

    const handlePostChange = (e) => {
        setPost(e.target.value)
    }

    const handlePlatformChange = (e) => {
        const value = e.target.value
        setSelectedPlatforms(prev =>
            prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
        )
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile)
        } else {
            alert('Please select an image file')
            e.target.value = ''
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Post:', post)
        console.log('Platforms:', selectedPlatforms)
        console.log('File:', file)

        // Reset form
        setPost('')
        setSelectedPlatforms([])
        setFile(null)

        // Redirect to upload pages for selected platforms
        selectedPlatforms.forEach(platform => {
            const selectedPlatform = platforms.find(p => p.name === platform)
            if (selectedPlatform) {
                window.open(selectedPlatform.uploadUrl, '_blank')
            }
        })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                Fish Outta Water Social Media
            </h1>
            <div className="max-w-2xl mx-auto space-y-8">
                <p className="text-center text-lg mb-8 text-blue-800">
                    Connect with our community of fish enthusiasts and share
                    your own fishies experiences!
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        placeholder="What's on your mind?"
                        value={post}
                        onChange={handlePostChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <div>
                        <label htmlFor="file" className="block mb-2">Upload Image</label>
                        <input
                            id="file"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Select Platforms to Upload</label>
                        <select
                            multiple
                            value={selectedPlatforms}
                            onChange={handlePlatformChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            {platforms.map((platform) => (
                                <option key={platform.name} value={platform.name}>
                                    {platform.icon} {platform.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Open Selected Platforms
                    </button>
                </form>
                <div className="grid grid-cols-2 gap-4">
                    {platforms.map((platform) => (
                        <a
                            key={platform.name}
                            href={platform.uploadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center p-4 rounded-lg ${platform.color} text-white hover:opacity-90 transition-opacity`}
                        >
                            <span className="mr-2">{platform.icon}</span>
                            <span>Open {platform.name}</span>
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
    )
}