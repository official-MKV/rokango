import React from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/Components/ui/button";
import Footer from "@/Components/Footer";

const founders = [
  {
    name: "Hanny Abubakar",
    role: "CEO & Co-Founder",
    image: "/hanny.png",
    bio: "Jane has over 15 years of experience in tech and is passionate about connecting businesses with reliable suppliers.",
    social: {
      twitter: "https://twitter.com/hanny",
      linkedin: "https://www.linkedin.com/in/hannyabubakar/",
    },
  },
  {
    name: "Vem Makplang",
    role: "CTO & Co-Founder",
    image: "/placeholder.svg?height=400&width=400",
    bio: "vem is a full-stack developer with a keen interest in building scalable platforms that revolutionize B2B interactions.",
    social: {
      twitter: "https://x.com/makp____",
      linkedin: "https://www.linkedin.com/in/makplang-vem/",
      github: "https://github.com/johnsmith",
    },
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Meet Our <span className="text-[#ffa458]">Founders</span>
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          The visionaries behind our mission to revolutionize B2B connections
        </p>
        <div className="flex items-center justify-center gap-8">
          {founders.map((founder, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-64 h-64 mb-6">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#ffa458] via-[#ffa458]/50 to-transparent rounded-full"
                  style={{ backdropFilter: "brightness(0.9)" }}
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{founder.name}</h2>
              <p className="text-[#ffa458] font-medium mb-4">{founder.role}</p>
              <p className="text-gray-600 mb-6 text-center">{founder.bio}</p>
              <div className="flex justify-center space-x-4">
                <a
                  href={founder.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#ffa458] transition-colors"
                >
                  <Twitter size={24} />
                  <span className="sr-only">
                    Twitter profile of {founder.name}
                  </span>
                </a>
                <a
                  href={founder.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#ffa458] transition-colors"
                >
                  <Linkedin size={24} />
                  <span className="sr-only">
                    LinkedIn profile of {founder.name}
                  </span>
                </a>
                <a
                  href={founder.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#ffa458] transition-colors"
                >
                  <Github size={24} />
                  <span className="sr-only">
                    GitHub profile of {founder.name}
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
