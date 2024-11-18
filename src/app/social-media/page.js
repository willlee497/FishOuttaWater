'use client'

import React, { useState } from 'react'
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { Label } from "../../components/ui/label"
import { TwitterIcon, YoutubeIcon, FacebookIcon, InstagramIcon } from 'lucide-react'

export default function SocialMedia() {
    const [post, setPost] = useState('')
    const [selectedPlatforms, setSelectedPlatforms] = useState([])
    const [file, setFile] = useState(null)

    const platforms = [
        { name: 'Twitter', Icon: TwitterIcon, color: 'bg-blue-400 hover:bg-blue-500', uploadUrl: 'https://twitter.com/compose/tweet' },
        { name: 'YouTube', Icon: YoutubeIcon, color: 'bg-red-600 hover:bg-red-700', uploadUrl: 'https://www.youtube.com/upload' },
        { name: 'Facebook', Icon: FacebookIcon, color: 'bg-blue-600 hover:bg-blue-700', uploadUrl: 'https://www.facebook.com/' },
        { name: 'Instagram', Icon: InstagramIcon, color: 'bg-pink-500 hover:bg-pink-600', uploadUrl: 'https://www.instagram.com/' },
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

    const handlePlatformChange = (platform) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
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

                    <div className="flex flex-wrap gap-4 justify-center">
                        {platforms.map((platform) => (
                            <div key={platform.name} className="flex flex-col items-center space-y-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={`${platform.color} text-white w-12 h-12 rounded-full transition-transform hover:scale-110`}
                                    onClick={() => handlePlatformChange(platform.name)}
                                >
                                    <platform.Icon className="w-6 h-6" />
                                </Button>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={platform.name}
                                        checked={selectedPlatforms.includes(platform.name)}
                                        onCheckedChange={() => handlePlatformChange(platform.name)}
                                    />
                                    <Label htmlFor={platform.name}>
                                        {platform.name}
                                    </Label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full p-2 border border-gray-300 rounded"
                    />

                    <Button type="submit" className="w-full">
                        Post
                    </Button>
                </form>
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