// src/components/todos/TodosHelpInfo.tsx
import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TodosHelpInfo() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        onClick={toggleVisibility}
      >
        <Info className="h-4 w-4" />
        {isVisible ? "Hide Help" : "View Help"}
      </Button>

      {isVisible && (
        <Card className="mt-2 bg-muted/30 border-dashed">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">
              Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>
                <span className="font-semibold">Enter/Space</span> - Open a todo
              </li>
              <li>
                <span className="font-semibold">E</span> - Edit a todo
              </li>
              <li>
                <span className="font-semibold">S</span> - Toggle status
              </li>
              <li>
                <span className="font-semibold">Delete</span> - Delete a todo
              </li>
            </ul>
          </CardContent>
          <CardFooter className="py-3">
            <p className="text-xs text-muted-foreground">
              Tip: You can view tasks in both List and Board views. Filtered
              views only show matching tasks.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
