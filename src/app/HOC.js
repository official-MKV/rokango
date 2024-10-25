// HOC.js
"use client";

import { useAuth } from "@/hooks/firebase";
import { useRouter } from "next/navigation";
import PendingApprovalMessage from "@/Components/PendingApproval";
import SideBar from "@/Components/SideBar";

export const withRoleGuard = (WrappedComponent, allowedRoles) => {
  const ProtectedComponent = ({ children, ...props }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // Check if user is not authenticated
    if (!user) {
      router.push("/login");
      return null;
    }

    // Check if user has the required role
    if (!allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
      return null;
    }

    // Pending Approval Message Component

    // Check if user is approved and active
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

  return ProtectedComponent;
};

// Make sure to export withRoleGuard as the default export
export default withRoleGuard;
