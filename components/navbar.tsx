import { auth } from "@/auth";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return <NavbarClient isLoggedIn={isLoggedIn} />;
}
