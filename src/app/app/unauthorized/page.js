import React from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-[#ffa459]" />
            <CardTitle className="text-2xl font-bold text-gray-800">
              Unauthorized
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your administrator
            or try logging in again.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/login">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-[#ffa459] hover:bg-[#ff9240] text-white">
              Go to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
