import { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    spaId?: string | null;
    branchId?: string | null;
    isSuperAdmin: boolean;
    isActive: boolean;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
