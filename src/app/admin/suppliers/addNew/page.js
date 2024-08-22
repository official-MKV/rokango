"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

export default function AddSupplierForm() {
  const router = useRouter();
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

  const addRetailerMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/addSupplier", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to add Supplier");
      }
      return response.json();
    },
    onSuccess: () => {
      router.push("/admin/suppliers");
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
    addRetailerMutation.mutate(formDataToSend);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Add New Supplier</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
          required
        />
        <Input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          name="businessAddress"
          placeholder="Business Address"
          value={formData.businessAddress}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input name="picture" type="file" onChange={handleFileChange} />
        <Button
          type="submit"
          disabled={addRetailerMutation.isPending}
          className="bg-[#ffa459] hover:bg-[#fc8f37]"
        >
          {addRetailerMutation.isPending ? "Adding..." : "Add Supplier"}
        </Button>
      </form>
    </div>
  );
}
