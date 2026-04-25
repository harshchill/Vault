import React from "react";
import Link from "next/link";
import { FiBookOpen, FiHeart, FiGithub, FiTwitter } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 relative overflow-hidden border-t border-teal-900/50 mt-20">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern mix-blend-overlay pointer-events-none" />
      
      {/* Footer Top Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2">
             <div className="flex items-center gap-2 text-white font-black text-2xl mb-4">
                <FiBookOpen className="text-teal-400" /> Vault
             </div>
             <p className="text-slate-500 max-w-sm font-medium leading-relaxed mb-6">
                Redefining the way you access, organize, and study past semester papers. Built for speed, precision, and zero friction.
             </p>
             <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition-colors">
                   <FiGithub size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition-colors">
                   <FiTwitter size={20} />
                </a>
             </div>
          </div>

          <div>
             <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Platform</h4>
             <ul className="space-y-4 text-sm font-medium">
               <li><Link href="/user/papers" className="hover:text-teal-400 transition-colors">Browse Library</Link></li>
               <li><Link href="/user/contributions" className="hover:text-teal-400 transition-colors">Leaderboard</Link></li>
               <li><Link href="/user/upload" className="hover:text-teal-400 transition-colors">Submit a Paper</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Legal & Help</h4>
             <ul className="space-y-4 text-sm font-medium">
               <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
               <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
               <li>
                 <a
                   href="mailto:support@paper-vault.app"
                   className="hover:text-teal-400 transition-colors"
                 >
                   support@paper-vault.app
                 </a>
               </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium">
           <p>© {new Date().getFullYear()} Vault Inc. All rights reserved.</p>
           <p className="flex items-center gap-1 mt-4 md:mt-0">
             Crafted with <FiHeart className="text-rose-500 fill-rose-500" /> for the student community.
           </p>
        </div>
      </div>
    </footer>
  );
}
