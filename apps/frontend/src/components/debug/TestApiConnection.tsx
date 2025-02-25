import { useEffect, useState } from "react";
import { todoService } from "@/service/todo";

export default function TestApiConnection() {
  const [result, setResult] = useState<{success?: boolean, error?: string}>({});
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        await todoService.getTodos();
        setResult({ success: true });
      } catch (error: unknown) {
        if (error instanceof Error) {
          setResult({ error: error.message });
        } else {
          setResult({ error: '發生未知錯誤' });
        }
      }
    };
    
    testConnection();
  }, []);
  
  return (
    <div>
      <h2>API Connection Test</h2>
      {result.success && <p className="text-green-500">Connection successful!</p>}
      {result.error && <p className="text-red-500">Error: {result.error}</p>}
    </div>
  );
}