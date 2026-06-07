import type { TUser } from "../api/types";

export const canViewCatalog = (user: TUser | null): boolean => {
  if (!user || user.role === "ADMIN") {
    return true;
  }

  return user.moderationStatus === "APPROVED";
};
