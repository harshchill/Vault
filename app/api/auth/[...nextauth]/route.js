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
    async session({ session, user, token }) {
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });
        
        if (dbUser) {
          session.user.name = dbUser.name || session.user.name || session.user.email?.split("@")[0];
          session.user.role = dbUser.role || 'user'; // Include role in session
        } else {
          // Fallback if user not found in DB
          session.user.name = session.user.name || session.user.email?.split("@")[0];
          session.user.role = 'user';
        }
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        // Return session with fallback values
        session.user.name = session.user.name || session.user.email?.split("@")[0];
        session.user.role = 'user';
        return session;
      }
    },
  },
});
export { authoptions as GET, authoptions as POST };
