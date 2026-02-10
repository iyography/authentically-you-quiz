"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";

// Floating particles - same as quiz page for brand consistency
const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: `${(i * 2.1) % 100}%`,
  delay: `${(i * 0.4) % 12}s`,
  size: `${1 + (i % 3)}px`,
}));

const SPARKLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${(i * 7.3) % 100}%`,
  top: `${(i * 11.7) % 100}%`,
  delay: `${(i * 0.3) % 2}s`,
}));

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100]">
      {PARTICLES.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            bottom: "-10px",
            animationDelay: particle.delay,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
      {SPARKLES.map((sparkle) => (
        <div
          key={`sparkle-${sparkle.id}`}
          className="sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animationDelay: sparkle.delay,
          }}
        />
      ))}
    </div>
  );
}

function AuroraBackground() {
  return (
    <>
      <div className="aurora-bg" />
      <div className="aurora-layer fixed inset-0 z-[2]" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[3]">
        <div
          className="floating-light w-[600px] h-[600px] bg-[#C5B4E3]/30"
          style={{ top: "5%", left: "-5%", animation: "auroraWave1 40s ease-in-out infinite" }}
        />
        <div
          className="floating-light w-[500px] h-[500px] bg-[#B4D4E3]/25"
          style={{ top: "50%", right: "-10%", animation: "auroraWave2 35s ease-in-out infinite" }}
        />
        <div
          className="floating-light w-[550px] h-[550px] bg-[#E3B4D4]/20"
          style={{ bottom: "10%", left: "20%", animation: "auroraWave3 45s ease-in-out infinite" }}
        />
        <div
          className="floating-light w-[450px] h-[450px] bg-[#E8D5B5]/25"
          style={{ top: "30%", left: "50%", animation: "auroraWave1 50s ease-in-out infinite reverse" }}
        />
      </div>
    </>
  );
}

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the new login API endpoint
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to dashboard - session cookie is set by the API
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calm-gradient-radial min-h-screen text-[#3D3D3D] relative">
      <AuroraBackground />
      <FloatingParticles />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="font-script text-2xl md:text-3xl text-[#3D3D3D] hover:opacity-80 transition-all">
            Authentically You
          </Link>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 soft-glow">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#C9A86C] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl mb-2 text-[#3D3D3D]">
                Admin Dashboard Access
              </h1>
              <p className="font-sans text-lg text-[#6B6B6B]">
                Sign in to view quiz results and analytics
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block font-sans text-sm font-medium text-[#3D3D3D] mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#6B6B6B]" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 font-sans border border-[#3D3D3D]/20 rounded-2xl bg-white/80 placeholder-[#6B6B6B] text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#C9A86C]/50 focus:border-[#C9A86C] transition-all"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block font-sans text-sm font-medium text-[#3D3D3D] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#6B6B6B]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 font-sans border border-[#3D3D3D]/20 rounded-2xl bg-white/80 placeholder-[#6B6B6B] text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#C9A86C]/50 focus:border-[#C9A86C] transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6B6B6B] hover:text-[#3D3D3D] transition-all"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !username || !password}
                className={`w-full font-sans font-semibold py-4 px-6 rounded-2xl transition-all ${
                  loading || !username || !password
                    ? "bg-[#3D3D3D]/20 text-[#6B6B6B]/50 cursor-not-allowed"
                    : "bg-[#C9A86C] text-white hover:bg-[#b8975b] soft-glow"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Access Admin Dashboard"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#3D3D3D]/10 text-center">
              <Link
                href="/"
                className="font-sans text-sm text-[#6B6B6B] hover:text-[#C9A86C] transition-all"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}