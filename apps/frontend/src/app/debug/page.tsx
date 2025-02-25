'use client';

import TestApiConnection from "@/components/debug/TestApiConnection";


export default function DebugPage() {


  return (
    <div className="flex min-h-screen items-center justify-center">
      <TestApiConnection/>
    </div>
  );
}