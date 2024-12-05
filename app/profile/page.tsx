"use client"

import {CustomError} from "../types/CustomError";
import { User } from "../types/User";
import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Spinner from "../components/Spinner";

const Profile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error((await response.json()).message || "Failed to fetch profile data");
        }

        const data = await response.json();
        setProfile(data.user);
      } catch (err) {
            const error = err as CustomError;
            setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
            {/* Profile Picture */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
            </div>

            {/* Profile Information */}
            <div className="w-full max-w-lg">
            {/* Email */}
            <div className="flex items-center justify-between mt-4">
                <p className="text-gray-700 text-lg">
                <strong>Email:</strong> {profile?.email || "example@example.com"}
                </p>
                <PencilSquareIcon className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </div>

            {/* Username */}
            <div className="flex items-center justify-between mt-4">
                <p className="text-gray-700 text-lg">
                <strong>Username:</strong> {profile?.username || "username123"}
                </p>
                <PencilSquareIcon className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </div>
            </div>
        </div>
    </div>

  );
};

export default Profile;

