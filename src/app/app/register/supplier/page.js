"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { EyeIcon, EyeOffIcon, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/Components/ui/progress";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SupplierSignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    businessAddress: "",
    password: "",
    confirmPassword: "",
    picture: null,
    active: true,
    status: "pending",
  });

  const signupMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/addSupplier", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to sign up");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        router.push("/");
      } catch (error) {
        console.error("Error signing in after signup:", error);
        router.push("/login");
        // alert(
        //   "Account created successfully, but there was an issue signing in. Please try logging in manually."
        // );
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    updateFormProgress();
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({ ...prevState, picture: e.target.files[0] }));
    updateFormProgress();
  };

  const updateFormProgress = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(
      (value) => value !== "" && value !== null
    ).length;
    setFormProgress((filledFields / totalFields) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key !== "confirmPassword") {
        formDataToSend.append(key, formData[key]);
      }
    }
    signupMutation.mutate(formDataToSend);
  };

  const isPasswordValid = formData.password.length >= 6;
  const doPasswordsMatch =
    formData.password === formData.confirmPassword && formData.password !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4"
    >
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-lg p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6 text-gray-800"
        >
          Create Your
          <span className="px-[1px]  text-[#ffa458]"> Rokango </span>
          Supplier Account
        </motion.h1>
        <p className="text-center text-gray-500 mb-6">
          Join us and streamline your business by managing your orders,
          products, and more.
        </p>

        <Progress
          value={formProgress}
          className="mb-6 text-[#ffa458]  [&>div]:bg-orange-400"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Business Name", name: "businessName", type: "text" },
            { label: "Phone Number", name: "phone", type: "tel" },
            { label: "Email Address", name: "email", type: "email" },
            {
              label: "Business Address",
              name: "businessAddress",
              type: "text",
            },
          ].map((field) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">
                {field.label}
              </label>
              <Input
                name={field.name}
                type={field.type}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full"
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
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
              className="w-full pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-7 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Confirm Password
            </label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-7 h-full px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </motion.div>

          <div className="text-sm text-gray-600">
            <p>Password must be at least 6 characters long.</p>
            <div className="flex items-center mt-2">
              {isPasswordValid ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span>Password meets requirements</span>
            </div>
            <div className="flex items-center mt-2">
              {doPasswordsMatch ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span>Passwords match</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Business Logo
            </label>
            <Input
              name="picture"
              type="file"
              onChange={handleFileChange}
              className="w-full"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={
                signupMutation.isPending ||
                !isPasswordValid ||
                !doPasswordsMatch
              }
              className="w-full py-3 bg-[#ffa459] hover:bg-[#fc8f37] text-white font-bold rounded-lg transition-colors duration-300"
            >
              {signupMutation.isPending
                ? "Signing Up..."
                : "Create Supplier Account"}
            </Button>
          </motion.div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Back to
          <a href="/" className="text-[#ffa459] hover:underline">
            {" "}
            Home Page
          </a>
          .
        </p>
      </div>
    </motion.div>
  );
}
