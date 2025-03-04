// apps/frontend/src/app/guide/page.tsx
"use client";

import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Check,
  Clock,
  X,
  List,
  LayoutGrid,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function GuidePage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8 gap-2">
        <BookOpen className="h-6 w-6 text-teal-500" />
        <h1 className="text-3xl font-bold">Todo App User Guide</h1>
      </div>

      <Tabs defaultValue="getting-started" className="mb-8">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-teal-500" />
                Welcome to Todo App
              </CardTitle>
              <CardDescription>
                Your simple and efficient task management solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Log in to your account</h3>
                <p className="text-sm text-muted-foreground">
                  Use the demo account for testing:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p>
                    <strong>Email:</strong> demo@example.com
                  </p>
                  <p>
                    <strong>Password:</strong> demo1234
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <h3 className="font-medium">Your Todo Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  After logging in, you'll be taken to your todo dashboard where
                  you can:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>See all your tasks</li>
                  <li>Create new tasks</li>
                  <li>Filter tasks by status</li>
                  <li>Switch between list and board views</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/todos">
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-teal-500" />
                Creating Your First Todo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-3">
                <li className="text-sm">
                  <p className="font-medium">Click the "Add Todo" button</p>
                  <p className="text-muted-foreground">
                    Located at the top right of your dashboard
                  </p>
                </li>
                <li className="text-sm">
                  <p className="font-medium">Fill in the todo details</p>
                  <p className="text-muted-foreground">
                    Enter a title, add an optional description, and select a
                    status
                  </p>
                </li>
                <li className="text-sm">
                  <p className="font-medium">Click "Create Todo"</p>
                  <p className="text-muted-foreground">
                    Your new task will appear in your todo list
                  </p>
                </li>
              </ol>
              <div className="bg-muted p-3 rounded-md text-sm mt-4">
                <p className="font-medium">Pro Tip:</p>
                <p className="text-muted-foreground">
                  Keep titles short and descriptive for better organization.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <List className="h-5 w-5 text-teal-500" />
                Task Status Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-medium">Pending</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tasks that are waiting to be started
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">In Progress</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tasks that are currently being worked on
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium">Completed</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tasks that have been finished
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Changing Task Status</h3>
                <p className="text-sm text-muted-foreground">
                  You can change a task's status in two ways:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Click on the status icon on the task card</li>
                  <li>Edit the task and change the status in the dropdown</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-teal-500" />
                Different Views
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <List className="h-5 w-5" />
                    <h4 className="font-medium">List View</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    See all your tasks in a compact list format, perfect for
                    quickly scanning through many tasks
                  </p>
                </div>
                <div className="border p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <LayoutGrid className="h-5 w-5" />
                    <h4 className="font-medium">Board View</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Visualize tasks by status in a kanban-style board, ideal for
                    workflow management
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Switching Views</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle between views using the view selector at the top of
                  your dashboard
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-teal-500" />
                Undo Delete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Made a mistake? When you delete a task, you have 5 seconds to
                undo the action:
              </p>
              <div className="bg-muted p-3 rounded-md text-sm">
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Delete a task by clicking the trash icon</li>
                  <li>A notification will appear with an "Undo" button</li>
                  <li>Click "Undo" to restore the deleted task</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-teal-500" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Enter/Space</span>
                    <span className="text-sm text-muted-foreground">
                      Open a todo
                    </span>
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">E</span>
                    <span className="text-sm text-muted-foreground">
                      Edit a todo
                    </span>
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">S</span>
                    <span className="text-sm text-muted-foreground">
                      Toggle status
                    </span>
                  </div>
                </div>
                <div className="border p-3 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Delete</span>
                    <span className="text-sm text-muted-foreground">
                      Delete a todo
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Productivity Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Group Related Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Begin task titles with project names or categories to keep
                  related tasks together.
                </p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p>
                    Example: "Website: Update homepage" and "Website: Fix
                    contact form"
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-medium">
                  Use the Board View for Workflows
                </h3>
                <p className="text-sm text-muted-foreground">
                  The board view is perfect for visualizing your workflow and
                  tracking progress at a glance.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-medium">Regular Cleanup</h3>
                <p className="text-sm text-muted-foreground">
                  Set aside time periodically to review and clean up completed
                  tasks.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">
                  Can I recover a deleted task after the undo period?
                </h3>
                <p className="text-sm text-muted-foreground">
                  No, once the 5-second undo period expires, tasks are
                  permanently deleted.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-medium">
                  Is there a limit to how many tasks I can create?
                </h3>
                <p className="text-sm text-muted-foreground">
                  For the demo account, there's no practical limit to the number
                  of tasks you can create.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-medium">
                  Can I share my tasks with other users?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Currently, the app doesn't support task sharing between users,
                  but this feature may be added in future updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild>
          <Link href="/todos">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
