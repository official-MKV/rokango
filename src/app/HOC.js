"use client";
import { useAuth } from "@/hooks/firebase"; // Adjust the import path as needed
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withRoleGuard(WrappedComponent, allowedRoles) {
  return function RoleGuard(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || !allowedRoles.includes(user.role))) {
        router.push("/unauthorized"); // Redirect to an unauthorized page
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // Or a proper loading component
    }

    if (!user || !allowedRoles.includes(user.role)) {
      return null; // Or a proper unauthorized component
    }

    return <WrappedComponent {...props} />;
  };
}

// Make sure to export the function as default as well
export default withRoleGuard;
