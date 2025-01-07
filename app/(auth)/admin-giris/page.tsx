"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockClosedIcon, EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (email === "admin@nakliyat.com" && password === "admin123") {
        router.push("/admin");
      } else {
        setError("Geçersiz e-posta veya şifre");
      }
    } catch {
      setError("Giriş yapılırken bir hata oluştu");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-100 relative overflow-hidden">
      {/* Dekoratif arka plan desenleri */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Giriş formu */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center space-y-6 mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 mb-2">
              <LockClosedIcon className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
                Hoş Geldiniz
              </h2>
              <p className="text-base text-gray-600">
                Yönetici panelinize giriş yapın
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div
                className={`group relative rounded-xl transition-all duration-300 ${
                  focusedInput === 'email'
                    ? 'shadow-lg shadow-indigo-100 bg-white'
                    : 'border border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center px-4 py-4">
                  <EnvelopeIcon className={`h-6 w-6 transition-colors duration-300 ${
                    focusedInput === 'email' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                  <div className="ml-3 flex-1">
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium transition-colors duration-300 ${
                        focusedInput === 'email' ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                    >
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      className="mt-2 block w-full border-0 p-0 text-lg text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                      placeholder="ornek@nakliyat.com"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`group relative rounded-xl transition-all duration-300 ${
                  focusedInput === 'password'
                    ? 'shadow-lg shadow-indigo-100 bg-white'
                    : 'border border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center px-4 py-4">
                  <KeyIcon className={`h-6 w-6 transition-colors duration-300 ${
                    focusedInput === 'password' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                  <div className="ml-3 flex-1">
                    <label
                      htmlFor="password"
                      className={`block text-sm font-medium transition-colors duration-300 ${
                        focusedInput === 'password' ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                    >
                      Şifre
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      className="mt-2 block w-full border-0 p-0 text-lg text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-4 text-sm font-semibold text-white hover:from-indigo-500 hover:to-indigo-600 focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Giriş Yap
              <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
} 