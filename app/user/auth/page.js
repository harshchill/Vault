"use client";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiGithub, FiCheckCircle } from "react-icons/fi";
import { useEffect } from "react";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = async (provider) => {
    await signIn(provider, { callbackUrl: "/user/dashboard" });
  }

  useEffect(() => {
    if(status === "authenticated" && session){
      router.push("/user/dashboard");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative Blob Canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob bg-teal-400/20 w-150 h-150 -top-32 -left-32 delay-100" />
        <div className="blob bg-emerald-400/10 w-125 h-125 bottom-0 -right-32 delay-300" style={{animationDuration: '12s'}} />
      </div>

      <div className="bg-grid-pattern absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none" />

      <div className="w-full max-w-5xl glass-panel relative z-10 flex flex-col md:flex-row overflow-hidden border border-white shadow-2xl shadow-teal-500/10 rounded-3xl min-h-150">
        
        {/* Left Side: Visual/Immersive Banner */}
        <div className="flex-1 bg-linear-to-br from-teal-500 to-emerald-600 p-12 text-white hidden md:flex md:flex-col md:justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-bl-full filter blur-3xl" />
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-6">Access Sequence</span>
            <h1 className="text-5xl font-extrabold leading-tight">Step into the <br/> Vault.</h1>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="w-10 h-10 rounded-full bg-white/20 flex shrink-0 items-center justify-center">
                <FiCheckCircle size={20} />
              </div>
              <p className="text-sm font-medium">Sync your saved papers across all devices instantly.</p>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="w-10 h-10 rounded-full bg-white/20 flex shrink-0 items-center justify-center">
                <FiCheckCircle size={20} />
              </div>
              <p className="text-sm font-medium">Contribute to the leaderboard and help your peers.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center animate-fade-in bg-white/60 backdrop-blur-xl">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Authenticate to access your verified papers.</p>
          </div>

          <div className="space-y-4">
            <button 
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 transition-all font-bold text-slate-700 group"
              onClick={() => handleSignIn("google")}
            >
              <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-teal-50 transition-colors">
                <FcGoogle size={24} />
              </div>
              Continue with Google
            </button>

            <button 
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 transition-all font-bold text-slate-700 group"
              onClick={() => handleSignIn("github")}
            >
              <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-teal-50 transition-colors text-slate-900">
                <FiGithub size={24} />
              </div>
              Continue with GitHub
            </button>
          </div>

          <div className="mt-12 text-center text-sm text-slate-500 font-medium max-w-xs mx-auto md:mx-0">
            By authenticating, you agree to our Terms of Service and Privacy Policy. Securely encrypted.
          </div>
        </div>

      </div>
    </div>
  );
}
