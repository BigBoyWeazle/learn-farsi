import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Resend } from "resend";
import { db } from "@/db";
import { authConfig } from "./auth.config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  events: {
    async createUser({ user }) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: "theyoungbitcoingroup@gmail.com",
          subject: "New Learn Farsi Sign-Up!",
          text: `A new user just signed up for Learn Farsi!\n\nEmail: ${user.email}\nName: ${user.name || "Not provided"}\nDate: ${new Date().toLocaleString("en-US", { timeZone: "Europe/Amsterdam" })}`,
        });
      } catch (error) {
        console.error("Failed to send new user notification email:", error);
      }
    },
  },
});
