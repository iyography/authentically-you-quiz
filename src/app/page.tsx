"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

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
        <video key={videos.hero} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
          <source src={videos.hero} type="video/mp4" />
        </video>
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
          <video key={videos.about} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={videos.about} type="video/mp4" />
          </video>
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
            <video key={videos.feature} autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src={videos.feature} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Find Your People */}
      <section className="h-[70vh] relative">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videos.findPeople} type="video/mp4" />
        </video>
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
        <video key={videos.whatIsnt} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videos.whatIsnt} type="video/mp4" />
        </video>
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
// DESIGN 2: Video-Heavy (Immersive Experience)
// ============================================
function Design2() {
  const videos = [
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038038/222_iguibm.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038037/4_gvs32m.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038048/28_thd2s6.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038037/12_orj6tj.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038049/27_f5tcak.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038038/11_l43mxb.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038054/25_s0tdt8.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038041/19_kuuyat.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038045/35_gohawn.mp4",
    "https://res.cloudinary.com/dzlnqcmqn/video/upload/q_auto,f_auto/v1769038060/18_u4hwoe.mp4",
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero - Full Screen Video */}
      <section className="h-screen relative overflow-hidden flex items-center justify-center">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videos[0]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-8">
          <h1 className="font-script text-8xl md:text-[10rem] lg:text-[14rem] text-white mb-4">
            Recess
          </h1>
          <p className="font-sans text-2xl md:text-3xl text-white/80 tracking-wide">
            Real relationships. Real support. Real community.
          </p>
        </div>
      </section>

      {/* Video Grid 1 */}
      <section className="grid grid-cols-2 md:grid-cols-3">
        {videos.slice(1, 4).map((vid, i) => (
          <div key={i} className="aspect-square relative overflow-hidden">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={vid} type="video/mp4" />
            </video>
          </div>
        ))}
      </section>

      {/* Simple CTA */}
      <section id="why" className="py-20 px-8 text-center">
        <p className="font-serif text-3xl md:text-4xl text-white/90 max-w-2xl mx-auto mb-8">
          Where Skool owners come to breathe.
        </p>
        <a href="https://www.skool.com/recess/about" className="inline-block font-sans text-lg border-2 border-white text-white px-12 py-4 hover:bg-white hover:text-black transition-all">
          Join Recess
        </a>
      </section>

      {/* Full Width Video */}
      <section className="h-[70vh] relative">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videos[4]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <p className="font-script text-5xl md:text-7xl text-white text-center px-8">
            Find your people.
          </p>
        </div>
      </section>

      {/* Video Grid 2 */}
      <section id="features" className="grid grid-cols-2">
        {videos.slice(5, 7).map((vid, i) => (
          <div key={i} className="aspect-[4/3] relative overflow-hidden">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={vid} type="video/mp4" />
            </video>
          </div>
        ))}
      </section>

      {/* Minimal Text */}
      <section id="for-you" className="py-24 px-8 text-center">
        <p className="font-sans text-xl text-white/60 tracking-widest uppercase mb-4">
          For Skool Owners Only
        </p>
        <p className="font-serif text-4xl md:text-5xl text-white max-w-3xl mx-auto">
          Rest. Connect. Grow.
        </p>
      </section>

      {/* More Videos */}
      <section className="grid grid-cols-3">
        {videos.slice(7, 10).map((vid, i) => (
          <div key={i} className="aspect-[3/4] relative overflow-hidden">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={vid} type="video/mp4" />
            </video>
          </div>
        ))}
      </section>

      {/* Final Full Screen */}
      <section className="h-screen relative flex items-center justify-center">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={videos[4]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-8">
          <h2 className="font-script text-6xl md:text-8xl text-white mb-8">
            Join Recess
          </h2>
          <a href="https://www.skool.com/recess/about" className="inline-block font-sans text-xl bg-white text-black px-16 py-5 hover:bg-white/90 transition-all">
            Enter
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 text-center">
        <span className="font-sans text-xs text-white/30">&copy; 2026 Recess</span>
      </footer>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  const [design, setDesign] = useState(1);

  return (
    <>
      <Navbar design={design} setDesign={setDesign} />
      {design === 1 && <Design1 />}
      {design === 2 && <Design2 />}
    </>
  );
}
