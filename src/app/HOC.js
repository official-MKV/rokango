"use client";

import { useAuth } from "@/hooks/firebase";
import { useRouter, usePathname } from "next/navigation";
import PendingApprovalMessage from "@/Components/PendingApproval";
import SideBar from "@/Components/SideBar";

// Define public routes that don't need authentication
const PUBLIC_ROUTES = ["/app", "/app/login"];

export const withRoleGuard = (WrappedComponent, allowedRoles) => {
  const ProtectedComponent = ({ children, ...props }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // If it's a public route, render without auth check
    if (isPublicRoute) {
      return <WrappedComponent {...props}>{children}</WrappedComponent>;
    }

    // For protected routes, check authentication
    if (!user) {
      // Redirect to login page on the app subdomain
      router.push("/app/login");
      return null;
    }

    // Check if user has the required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/app/unauthorized");
      return null;
    }

    // Pending Approval Message Component
    if (
      user.role === "supplier" &&
      (!user.status || user.status !== "approved" || !user.active)
    ) {
      return (
        <>
          <SideBar disabled={true} />
          <PendingApprovalMessage />
        </>
      );
    }

    return <WrappedComponent {...props}>{children}</WrappedComponent>;
  };

  // Preserve the wrapped component's display name for debugging
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ProtectedComponent.displayName = `withRoleGuard(${displayName})`;

  return ProtectedComponent;
};

export default withRoleGuard;
