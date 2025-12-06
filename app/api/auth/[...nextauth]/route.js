import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { User } from "@/models/user";
import connectDB from "@/db/connectDb";

export const authoptions = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      
        await connectDB();
        const currentUser = await User.findOne({ email: user.email });
        if (!currentUser) {
            await User.create({
            email: user.email,
            username: user.email.split("@")[0],
          });
        }
        return true;
      
    },
    async session({ session, user, token }) {
      const dbUser = await User.findOne({ email: session.user.email });
      session.user.name = dbUser.username;
      return session;
    },
  },
});
export { authoptions as GET, authoptions as POST };
