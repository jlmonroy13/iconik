import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    isSuperAdmin?: boolean;
    spaId?: string | null;
  }
  interface Session {
    user: User & DefaultSession["user"];
  }
}
