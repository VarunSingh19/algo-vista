'use client';
import React, { useState } from 'react';
import {
    Briefcase,
    Users,
    Target,
    Zap,
    ArrowRight,
    Code,
    Brain,
    Rocket,
    Star,
    CheckCircle,
    MapPin,
    Clock,
    DollarSign,
    Heart,
    Coffee,
    Award,
    TrendingUp
} from 'lucide-react';

export default function CareerPage() {
    const [hoveredPosition, setHoveredPosition] = useState(null);

    const positions = [
        {
            id: 1,
            title: "Full Stack Developer",
            department: "Engineering",
            location: "Remote/Hybrid",
            type: "Full-time",
            experience: "0-1 year",
            skills: ["React", "Node.js", "MongoDB", "TypeScript"],
            description: "Build and maintain our learning platform, create interactive coding challenges, and develop user-friendly interfaces."
        },
        {
            id: 2,
            title: "Content Creator",
            department: "Education",
            location: "Remote",
            type: "Full-time",
            experience: "0",
            skills: ["DSA", "System Design", "Technical Writing", "Video Creation"],
            description: "Create engaging educational content, tutorials, and coding challenges for our growing community of learners."
        },
        {
            id: 3,
            title: "UI/UX Designer",
            department: "Design",
            location: "Remote/Hybrid",
            type: "Full-time",
            experience: "0",
            skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
            description: "Design intuitive user experiences and create beautiful interfaces that make learning DSA enjoyable and effective."
        },
        {
            id: 4,
            title: "Marketing Specialist",
            department: "Marketing",
            location: "Remote",
            type: "Full-time",
            experience: "0",
            skills: ["Digital Marketing", "Content Strategy", "SEO", "Analytics"],
            description: "Drive growth through strategic marketing campaigns and help more developers discover our platform."
        }
    ];

    const benefits = [
        {
            icon: <Heart className="w-5 h-5" />,
            title: "Health & Wellness",
            description: "Comprehensive health insurance and wellness programs"
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: "Flexible Hours",
            description: "Work-life balance with flexible scheduling options"
        },
        {
            icon: <Rocket className="w-5 h-5" />,
            title: "Growth Opportunities",
            description: "Continuous learning and career advancement paths"
        },
        {
            icon: <Coffee className="w-5 h-5" />,
            title: "Remote Culture",
            description: "Work from anywhere with our remote-first approach"
        },
        {
            icon: <Award className="w-5 h-5" />,
            title: "Competitive Pay",
            description: "Industry-leading compensation and equity options"
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Amazing Team",
            description: "Collaborate with passionate, talented individuals"
        }
    ];

    const values = [
        {
            icon: <Target className="w-6 h-6" />,
            title: "Excellence",
            description: "We strive for the highest quality in everything we do"
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Innovation",
            description: "We embrace new ideas and cutting-edge technologies"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Community",
            description: "We build inclusive environments where everyone thrives"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Growth",
            description: "We invest in continuous learning and development"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-4 h-4 bg-orange-500 rounded-full opacity-60"></div>
                <div className="absolute top-40 right-20 w-6 h-6 bg-blue-500 rounded-full opacity-40"></div>
                <div className="absolute bottom-32 left-1/4 w-8 h-8 bg-green-500 rounded-full opacity-30"></div>
                <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-purple-500 rounded-full opacity-50"></div>
                <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-yellow-500 rounded-full opacity-60"></div>
            </div>

            {/* Hero Section */}
            <div className="relative container max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
                        <Briefcase className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-500 text-sm font-medium">We're Hiring!</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="text-white">Build Your Career with </span>
                        <span className="text-orange-500">VibeArmor</span>
                    </h1>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                        Join our mission to empower developers worldwide. Help us create the best platform
                        for mastering DSA and advancing careers in tech.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-orange-500 mb-1">3+</div>
                            <div className="text-gray-400 text-sm">Team Members</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-500 mb-1">1,250+</div>
                            <div className="text-gray-400 text-sm">Active Users</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-500 mb-1">95%</div>
                            <div className="text-gray-400 text-sm">Success Rate</div>
                        </div>
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Join VibeArmor?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 text-center"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                                <p className="text-gray-400 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Open Positions */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-4">Open Positions</h2>
                    <p className="text-gray-400 text-center mb-12">Find your perfect role and grow with us</p>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {positions.map((position) => (
                            <div
                                key={position.id}
                                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                onMouseEnter={() => setHoveredPosition(position.id)}
                                onMouseLeave={() => setHoveredPosition(null)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-1">{position.title}</h3>
                                        <div className="text-orange-500 text-sm font-medium">{position.department}</div>
                                    </div>
                                    <div className="text-right text-sm text-gray-400">
                                        <div className="flex items-center gap-1 mb-1">
                                            <MapPin className="w-3 h-3" />
                                            {position.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {position.type}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{position.description}</p>

                                <div className="mb-4">
                                    <div className="text-gray-400 text-xs font-medium mb-2">Required Skills:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {position.skills.map((skill, idx) => (
                                            <span key={idx} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-lg text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">{position.experience} experience</span>
                                    <div className={`flex items-center gap-2 text-orange-500 text-sm font-medium transition-transform duration-200 ${hoveredPosition === position.id ? 'translate-x-2' : ''}`}>
                                        <a href='https://forms.gle/UD11TqMHNKJx1tGo8' target='_blank'>Apply Now</a>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Benefits & Perks</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application CTA */}
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl p-12 border border-orange-500/20 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Team?</h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            Don't see a position that fits? We're always looking for talented individuals.
                            Tell us about yourself and how you'd like to contribute to VibeArmor.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-center gap-2 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>Quick 5-minute application process</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>We respond to all applications within 48 hours</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>Join a community of passionate developers</span>
                            </div>
                        </div>

                        <a
                            href="https://forms.gle/UD11TqMHNKJx1tGo8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
                        >
                            <Briefcase className="w-5 h-5" />
                            Apply Now - Fill Our Form
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <p className="text-gray-400 text-sm mt-4">
                            Questions? Email us at vibearmorofficial@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
