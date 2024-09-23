"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SupplierSignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    businessAddress: "",
    password: "",
    picture: null,
    active: true,
  });

  const signupMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to sign up");
      }
      return response.json();
    },
    onSuccess: () => {
      router.push("/welcome");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({ ...prevState, picture: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    signupMutation.mutate(formDataToSend);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Supplier Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join us and streamline your business by managing your orders,
          products, and more.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <Input
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Business Name
            </label>
            <Input
              name="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number
            </label>
            <Input
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Business Address
            </label>
            <Input
              name="businessAddress"
              placeholder="Enter your business address"
              value={formData.businessAddress}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4 text-gray-600" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Business Logo
            </label>
            <Input
              name="picture"
              type="file"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full py-3 bg-[#ffa459] hover:bg-[#fc8f37] text-white font-bold rounded-lg"
          >
            {signupMutation.isPending
              ? "Signing Up..."
              : "Create Supplier Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Back to
          <a href="/" className="text-[#ffa459]">
            {" "}
            Home Page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
