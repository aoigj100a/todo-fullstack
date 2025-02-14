// src/app/profile/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user } = useAuth();

//   if (!user) {
//     return <div className="container max-w-2xl mx-auto p-4">Loading...</div>;
//   }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              {/* <p className="mt-1">{user.name}</p> */}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              {/* <p className="mt-1">{user.email}</p> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}