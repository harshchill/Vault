import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/models/user";
import connectDB from "@/db/connectDb";

export const authoptions = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
   
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      // Add role to token on first sign in
      if (user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.role = dbUser.role || 'user';
            token.name = dbUser.name || user.name;
          } else {
            token.role = 'user';
            token.name = user.name;
          }
        } catch (error) {
          console.error('Error in jwt callback:', error);
          token.role = 'user';
        }
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await connectDB();
        const currentUser = await User.findOne({ email: user.email });
        
        if (!currentUser) {
          // Use name from provider, fallback to email prefix if name not available
          const userName = user.name || user.email?.split("@")[0] || 'User';
          
          await User.create({
            email: user.email,
            name: userName,
            role: 'user', // Default role for new users
          });
        } else {
          // Update name if it's missing or if provider has a better name
          if (user.name && (!currentUser.name || currentUser.name === currentUser.email?.split("@")[0])) {
            currentUser.name = user.name;
            await currentUser.save();
          }
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      // Get role from token (set in jwt callback)
      if (token) {
        session.user.role = token.role || 'user';
        session.user.name = token.name || session.user.name || session.user.email?.split("@")[0];
      } else {
        // Fallback: try to get from database
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.name = dbUser.name || session.user.name || session.user.email?.split("@")[0];
            session.user.role = dbUser.role || 'user';
          } else {
            session.user.name = session.user.name || session.user.email?.split("@")[0];
            session.user.role = 'user';
          }
        } catch (error) {
          console.error('Error in session callback:', error);
          session.user.name = session.user.name || session.user.email?.split("@")[0];
          session.user.role = 'user';
        }
      }
      return session;
    },
  },
});
export { authoptions as GET, authoptions as POST };
