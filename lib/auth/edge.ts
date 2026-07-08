import NextAuth from "next-auth";

export const { auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [], // No providers needed in Edge runtime for token checking
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.admissionNumber = user.admissionNumber;
        token.grade = user.grade;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "student" | "admin";
        session.user.admissionNumber = token.admissionNumber as string | undefined;
        session.user.grade = token.grade as any;
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  trustHost: true,
});
