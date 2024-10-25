"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/Components/ui/use-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { useParams } from "next/navigation";
import { Switch } from "@/Components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState(params.id);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

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
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/deleteRetailer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ retailerId: userId }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Retailer account and related data have been deleted",
        });
        router.push("/retailers");
        queryClient.invalidateQueries(["users", { role: "retailer" }]);
      } else {
        throw new Error(result.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting retailer:", error);
      toast({
        title: "Error",
        description: "Failed to delete retailer account",
        variant: "destructive",
      });
    }
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

  const handleDeactivate = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { active: false });
      setUser({ ...user, active: false });
      setEditedUser({ ...editedUser, active: false });
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
      queryClient.invalidateQueries(["users", { role: "retailer" }]);
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
    router.push("/");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Button onClick={handleGoBack} className="mb-4">
        Go Back
      </Button>
      <h1 className="text-2xl font-bold text-center mb-6">Retailer Details</h1>
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
      <div className="flex flex-col space-y-4 mt-6">
        {editMode && (
          <Button
            onClick={handleSave}
            className="bg-[#ffa459] hover:bg-[#ff9040] text-white"
          >
            Save Changes
          </Button>
        )}
        {user.active ? (
          <Button
            onClick={handleDeactivate}
            className="border-2 w-fit border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
          >
            Deactivate Account
          </Button>
        ) : (
          <Button
            onClick={handleActivate}
            className="bg-green-200/50 w-fit border-green-500 border-2 hover:bg-green-200 text-green-500"
          >
            Activate Account
          </Button>
        )}
      </div>

      <div className="mt-12">
        <Button
          onClick={() => setShowDeleteDialog(true)}
          className="w-fit bg-red-600 hover:bg-red-700 text-white font-bold py-3"
        >
          Delete Account
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              supplier's account and remove all associated data, including
              product listings, order history, and any other related information
              from our system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
