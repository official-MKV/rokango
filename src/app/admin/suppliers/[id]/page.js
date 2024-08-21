"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/Components/ui/use-toast";
import {
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { useParams } from "next/navigation";
import { Switch } from "@/Components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState(params.id);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUser(userDoc.data());
          setEditedUser(userDoc.data());
        } else {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, toast]);

  if (isLoading) return <div>Loading user data...</div>;
  if (!user) return <div>User not found</div>;

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, editedUser);
      setUser(editedUser);
      toast({
        title: "Success",
        description: "User information updated successfully",
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user information",
        variant: "destructive",
      });
    }
  };
  const updateInactiveProducts = async ({ userId, state }) => {
    const productsSnapshot = await getDocs(
      query(collection(db, "products"), where("supplier.id", "==", userId))
    );
    console.log(userId);
    const batch = writeBatch(db);
    productsSnapshot.docs.forEach((productDoc) => {
      batch.update(productDoc.ref, { active: state });
    });
    await batch.commit();
  };

  const handleDeactivate = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { active: false });
      setUser({ ...user, active: false });
      setEditedUser({ ...editedUser, active: false });
      await updateInactiveProducts({ userId, state: false });
      queryClient.invalidateQueries(["users", { role: "supplier" }]);
      toast({
        title: "Success",
        description: "User account deactivated",
      });
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate user account",
        variant: "destructive",
      });
    }
  };
  const handleActivate = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { active: true });
      setUser({ ...user, active: true });
      setEditedUser({ ...editedUser, active: true });
      await updateInactiveProducts({ userId, state: true });
      queryClient.invalidateQueries(["users", { role: "supplier" }]);
      toast({
        title: "Success",
        description: "User account deactivated",
      });
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate user account",
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Button onClick={handleGoBack} className="mb-4">
        Go Back
      </Button>
      <h1 className="text-2xl font-bold text-center mb-6">Supplier Details</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <Button
            onClick={handleEditToggle}
            style={{ backgroundColor: "#ffa459" }}
          >
            {editMode ? "Cancel" : "Edit"}
          </Button>
        </div>
        {["businessName", "email", "phone", "businessAddress"].map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Label>
            <Input
              id={field}
              name={field}
              value={editMode ? editedUser[field] : user[field]}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={editMode ? editedUser.active : user.active}
            onCheckedChange={(checked) =>
              editMode
                ? setEditedUser({ ...editedUser, active: checked })
                : null
            }
            disabled={!editMode}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        {editMode && (
          <Button onClick={handleSave} style={{ backgroundColor: "#ffa459" }}>
            Save Changes
          </Button>
        )}
        {user.active ? (
          <Button onClick={handleDeactivate} variant="destructive">
            Deactivate Account
          </Button>
        ) : (
          <Button
            onClick={handleActivate}
            variant="primary"
            className="bg-green-500 text-white"
          >
            Activate
          </Button>
        )}
      </div>
    </div>
  );
}
