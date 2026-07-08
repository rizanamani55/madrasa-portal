import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase/client";
import { adminLoginSchema, admissionLoginSchema } from "@/lib/validations/schemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [
    // ─── Student / Parent Provider ────────────────────────
    Credentials({
      id: "student",
      name: "Admission Number",
      credentials: {
        name: { label: "Student Name", type: "text" },
        admissionNumber: { label: "Admission Number", type: "text" },
      },
      async authorize(credentials) {
        const parsed = admissionLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const { data: student, error } = await supabase
            .from("students")
            .select("*")
            .eq("admission_number", parsed.data.admissionNumber)
            .single();

          if (error || !student || student.status !== "active") {
            return null;
          }

          // Verify name (case-insensitive match)
          if (student.name.toLowerCase().trim() !== parsed.data.name.toLowerCase().trim()) {
            return null;
          }

          return {
            id: student.admission_number,
            name: student.name,
            role: "student" as const,
            admissionNumber: student.admission_number,
            grade: student.grade as any,
          };
        } catch (err) {
          console.error("Student auth error:", err);
          return null;
        }
      },
    }),

    // ─── Admin Provider ───────────────────────────────────
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Admin login attempt credentials received:", credentials);
        const parsed = adminLoginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.log("Zod validation failed for admin login:", parsed.error.issues);
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        console.log("Configured admin email:", adminEmail);
        console.log("Hash present:", !!adminHash);

        if (!adminEmail || !adminHash) {
          console.error("Admin credentials not configured in env vars.");
          return null;
        }

        const emailMatch =
          parsed.data.email.toLowerCase() === adminEmail.toLowerCase();
        console.log("Email match result:", emailMatch);
        if (!emailMatch) return null;

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          adminHash
        );
        console.log("Password match result:", passwordMatch);
        if (!passwordMatch) return null;

        return {
          id: "admin",
          name: "Administrator",
          email: adminEmail,
          role: "admin" as const,
        };
      },
    }),
  ],
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
