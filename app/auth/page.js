"use client";
import { signIn, signOut} from "next-auth/react";
import { FiGithub, FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

    const handleSignIn = async (provider) => {
        await signIn(provider);
    }
export default function AuthPage() {
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
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Email"
              type="email"
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Password"
              type="password"
            />
          </div>
          <button className="button button-ghost w-full justify-center border border-emerald-100">
            <FiMail size={18} />
            Continue with email
          </button>
        </div>
        <p className="text-xs text-slate-500 text-center">
          This is a frontend-only MVP preview. Hook up your auth provider to enable sign in.
        </p>
      </div>
    </div>
  );
}

