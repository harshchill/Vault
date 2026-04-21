"use client";
import { signIn, signOut} from "next-auth/react";
import { FiGithub, FiMail } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";

  
    
export default function AuthPage() {
  const { data: session, status } = useSession();
    const router = useRouter();

    const handleSignIn = async (provider) => {
        await signIn(provider);
    }

    useEffect(() => {
        // Check if session status is authenticated, not just if session exists
        if(status === "authenticated" && session){
            router.push("/");
        }
    }, [session, status, router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
      <div className="space-y-4">
        <span className="pill">Secure, simple access</span>
        <h1 className="text-4xl font-semibold text-slate-900">Login or create an account</h1>
        <p className="text-lg text-slate-600">
          Sign in with Google or GitHub to sync your saved papers and continue where you left off.
        </p>
        <ul className="space-y-3 text-slate-700">
          <li className="flex gap-3">
            <span className="mt-1 h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-xs font-semibold">
              1
            </span>
            Browse past papers instantly.
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-xs font-semibold">
              2
            </span>
            Save favorites and quick filters.
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-xs font-semibold">
              3
            </span>
            Keep your study flow in one place.
          </li>
        </ul>
      </div>

      <div className="card p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Continue with</h2>
        <div className="space-y-3">
          <button className="button button-primary w-full justify-center" onClick={() => handleSignIn("google")}>
            <FcGoogle size={20} />
            Continue with Google
          </button>
          <button className="button w-full justify-center border border-slate-200 hover:border-emerald-200" onClick={() => handleSignIn("github")}>
            <FiGithub size={20} />
            Continue with GitHub
          </button>
        </div>
        
      </div>
    </div>
  );
}

