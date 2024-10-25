"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/firebase";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Ensure this path is correct for your Firebase configuration

const SettingsPage = () => {
  const user = useAuth();
  const [profile, setProfile] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(user.user);
    }
  }, [user]);

  const handleResetPassword = async () => {
    if (profile?.email) {
      try {
        await sendPasswordResetEmail(auth, profile.email);
        setShowModal(true);
      } catch (error) {
        console.error("Error sending password reset email:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Business Profile</h1>

      <div className="flex md:items-start items-center mb-6 flex-col">
        <Avatar className="w-24 h-24 mr-6">
          <AvatarImage src={profile?.picture} alt="Business Logo" />
          <AvatarFallback>{profile?.businessName?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-grow w-full">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 min-h-[200px]">
            <div className="flex flex-wrap justify-between gap-4 mb-6">
              <ProfileItem
                title="Business Name"
                value={profile?.businessName}
              />
              <ProfileItem
                title="Business Location"
                value={profile?.businessAddress}
              />
              <ProfileItem title="Phone Number" value={profile?.phone} />
              <ProfileItem title="Business Owner Name" value={profile?.name} />
            </div>
          </div>

          <div className="relative mt-10">
            <h1 className="text-3xl font-bold mb-6">User Settings</h1>
            <div className="bg-white rounded-lg min-h-[200px] flex items-start">
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleResetPassword}
                    className="bg-[#ffa459] hover:bg-[#ff8745] text-white font-bold py-2 px-6 rounded-lg shadow-md"
                  >
                    Reset Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <Image
                      src="/rokango.png"
                      alt="Rokango Logo"
                      width={80}
                      height={80}
                      className="mx-auto mb-4"
                    />
                    <DialogTitle className="text-2xl font-bold text-[#ffa459]">
                      Password Reset
                    </DialogTitle>
                    <DialogDescription>
                      A password reset email has been sent to{" "}
                      <span className="font-semibold">{profile?.email}</span>.
                      Please check your inbox to reset your password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 text-center">
                    <Button
                      onClick={() => setShowModal(false)}
                      className="bg-[#ffa459] hover:bg-[#ff8745] text-white font-bold py-2 px-6 rounded-lg shadow-md"
                    >
                      Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ title, value }) => (
  <div className="flex-1 min-w-[200px]">
    <h3 className="text-lg font-semibold text-black">{title}</h3>
    <p className="text-base text-gray-700 hover:text-black">
      {value || "Not provided"}
    </p>
  </div>
);

export default SettingsPage;
