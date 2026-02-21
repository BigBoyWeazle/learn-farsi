import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Learn Farsi. Send us feedback, questions, or feature requests for learning Persian.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-persian-beige-200 flex flex-col">
      <div className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}
