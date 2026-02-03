"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";

// Generate poster image URL from Cloudinary video URL
function getPosterFromVideo(videoUrl: string): string {
  return videoUrl
    .replace("/video/upload/q_auto,f_auto/", "/video/upload/so_0,f_jpg,q_auto/")
    .replace(".mp4", ".jpg");
}

// AutoPlay Video component - hides video until playing to avoid play button
function AutoPlayVideo({ src, className }: { src: string; className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const posterUrl = getPosterFromVideo(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted state (required for mobile autoplay)
    video.muted = true;

    // Show video when it starts playing
    const handlePlaying = () => setIsPlaying(true);
    video.addEventListener("playing", handlePlaying);

    // Attempt to play
    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    // Try on various events
    video.addEventListener("loadedmetadata", playVideo);
    video.addEventListener("canplay", playVideo);
    playVideo();

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playVideo();
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(video);

    // User interaction fallback
    const handleInteraction = () => playVideo();
    document.addEventListener("touchstart", handleInteraction, { once: true, passive: true });
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true, passive: true });

    return () => {
      observer.disconnect();
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  return (
    <div className={className} style={{ backgroundImage: `url(${posterUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

// ============================================
// DESIGN 1: Dark Luxe (Current)
// ============================================
function Design1() {
  const videos = {
    hero: "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038060/18_u4hwoe.mp4",
    about: "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038045/35_gohawn.mp4",
    feature: "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038049/27_f5tcak.mp4",
    findPeople: "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038041/19_kuuyat.mp4",
    whatIsnt: "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038038/11_l43mxb.mp4",
  };

  return (
    <div className="bg-[#0A0A0A] text-[#FAF6E3] relative">
      {/* Hero */}
      <section className="min-h-screen relative overflow-hidden flex items-center">
        <AutoPlayVideo src={videos.hero} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-20 max-w-5xl mx-auto px-8 py-32 text-center">
          <h1 className="font-script text-7xl md:text-9xl lg:text-[12rem] leading-tight mb-8">
            Recess
          </h1>
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#FAF6E3] max-w-3xl mx-auto mb-6 leading-relaxed">
            Where Skool owners come to relax and unwind.
          </p>
          <p className="font-sans text-xl md:text-2xl text-[#FAF6E3]/70 max-w-2xl mx-auto mb-12">
            Real relationships. Real support. Real connections.
          </p>
          <a href="https://www.skool.com/recess/about" className="inline-block font-sans font-semibold bg-[#D4A853] text-[#0A0A0A] px-12 py-4 rounded-full hover:bg-[#c49943] transition-colors">
            Join Recess
          </a>
        </div>
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <span className="font-sans text-xs tracking-widest text-[#D4A853]/60">EST. 2026</span>
          <span className="font-sans text-xs tracking-widest text-[#D4A853]/60">FOR SKOOL OWNERS ONLY</span>
        </div>
      </section>

      {/* What Is Recess - Video & Text */}
      <section id="why" className="grid lg:grid-cols-2">
        <div className="aspect-square lg:aspect-auto lg:h-screen relative">
          <AutoPlayVideo src={videos.about} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-center p-12 lg:p-24">
          <div className="max-w-lg">
            <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#D4A853] block mb-6">What Is Recess?</span>
            <h2 className="font-serif text-4xl lg:text-5xl leading-relaxed mb-8">
              A community I built to give back.
            </h2>
            <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed mb-6">
              I grew Business Builders Club to Top 10 on Skool in 5 weeks. Over 2,000 members. Growth I never imagined.
            </p>
            <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed mb-6">
              Not a place to struggle, but a place for people to find help, support, and advice to grow their communities.
            </p>
            <p className="font-serif text-2xl text-[#D4A853] italic">
              So I built Recess. A place where Skool owners come to breathe.
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Here */}
      <section id="features" className="py-24 px-8 bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#D4A853] block mb-4 text-center">What Happens Here</span>
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="p-10 border border-[#FAF6E3]/10 rounded-2xl">
              <span className="text-4xl mb-4 block">🎯</span>
              <h3 className="font-serif text-3xl mb-4">Weekly Skool Spotlight</h3>
              <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed">
                Every week, we feature one Skool. The whole community shows up to support, give feedback, and help it grow.
              </p>
            </div>
            <div className="p-10 border border-[#FAF6E3]/10 rounded-2xl">
              <span className="text-4xl mb-4 block">🤝</span>
              <h3 className="font-serif text-3xl mb-4">Founder Pair-Ups</h3>
              <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed">
                Get matched with another Skool owner at your level. Accountability. Friendship. Someone who actually gets it.
              </p>
            </div>
            <div className="p-10 border border-[#FAF6E3]/10 rounded-2xl">
              <span className="text-4xl mb-4 block">🎉</span>
              <h3 className="font-serif text-3xl mb-4">Friday Wins</h3>
              <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed">
                Every Friday, we celebrate the small stuff. First post. First member. First sale. Every win matters here.
              </p>
            </div>
            <div className="p-10 border border-[#FAF6E3]/10 rounded-2xl">
              <span className="text-4xl mb-4 block">💬</span>
              <h3 className="font-serif text-3xl mb-4">Real Conversations</h3>
              <p className="font-sans text-lg text-[#FAF6E3]/60 leading-relaxed">
                No posturing. No highlight reels. Just honest talk about what&apos;s working, what&apos;s not, and what&apos;s next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Video */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden">
            <AutoPlayVideo src={videos.feature} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Find Your People */}
      <section className="h-[70vh] relative">
        <AutoPlayVideo src={videos.findPeople} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <p className="font-script text-5xl md:text-7xl text-white text-center px-8">
            Find your people.
          </p>
        </div>
      </section>

      {/* This Is For You */}
      <section id="for-you" className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#D4A853] block mb-6">This Is For You</span>
          <p className="font-serif text-3xl lg:text-4xl leading-relaxed mb-8">
            Whether you&apos;re just starting or scaling. Whether you have 5 members or 5,000. Whether you&apos;re figuring it out or crushing it.
          </p>
          <p className="font-sans text-xl text-[#FAF6E3]/70 italic">
            If you&apos;re building a Skool, you belong here.
          </p>
        </div>
      </section>

      {/* What This Isn't */}
      <section className="py-24 px-8 relative overflow-hidden">
        <AutoPlayVideo src={videos.whatIsnt} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-[#D4A853] block mb-8">What This Isn&apos;t</span>
          <p className="font-sans text-2xl text-[#FAF6E3]/80 mb-8">
            Not a course. Not a content library. Not another place selling tactics.
          </p>
          <p className="font-serif text-4xl lg:text-5xl text-[#FAF6E3] italic">
            This is rest. This is connection. This is Recess.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 text-center">
        <span className="font-sans text-sm tracking-[0.5em] uppercase text-[#D4A853] block mb-8">Ready?</span>
        <h2 className="font-serif text-5xl lg:text-6xl mb-10">
          Take a break with us.
        </h2>
        <a href="https://www.skool.com/recess/about" className="inline-block font-sans font-semibold bg-[#D4A853] text-[#0A0A0A] px-14 py-5 rounded-full hover:bg-[#c49943] transition-colors text-xl">
          Join Recess
        </a>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-[#FAF6E3]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-script text-3xl">Recess</span>
          <span className="font-sans text-xs text-[#FAF6E3]/30">&copy; 2026 Recess. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  return (
    <>
      <Navbar />
      <Design1 />
    </>
  );
}
