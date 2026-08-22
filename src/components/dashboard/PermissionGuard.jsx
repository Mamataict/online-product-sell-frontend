"use client";

import { useAuth } from "@/hooks/useAuth";

export default function PermissionGuard({
  permission,
  children,
}) {
  const { hasPermission, loading } = useAuth();

  if (loading || !hasPermission(permission)) {
    return null;
  }

  return children;
}