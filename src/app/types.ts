export type UserRole = "admin" | "editor" | "viewer" | "guest" | "owner" | "inactive";

export type User = {
  id: string;
  name: string;
  surname: string;
  role: string;
  team: string;
  email: string;
  userRole: UserRole;
  details: string;
};
