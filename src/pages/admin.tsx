import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "@/lib/isTokenValid";
import {
  Upload,
  Plus,
  Users,
  MessageSquare,
  FileText,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DocumentList from "@/pages/documents/List.tsx";
import DocumentUpload from "@/pages/documents/Upload.tsx";
import UserList from "@/pages/users/List.tsx";
import { useGetAdminStatsQuery } from "@/store/admin/api";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { data: stats, isLoading, isError } = useGetAdminStatsQuery();

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        <div className="mb-8 border-b pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                ADMIN DASHBOARD
              </p>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name || "Admin"}
            </h1>
            <p className="text-muted-foreground">
              Manage your healthcare platform
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
        </div>

        {isError && (
          <Alert variant="destructive">
            <AlertDescription>Failed to load statistics.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Users Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Users
              </h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            {isLoading ? (
              <></>
            ) : (
              <>
                <p className="text-3xl font-bold">
                  {stats?.totalUsers.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Active user accounts
                </p>
              </>
            )}
          </div>

          {/* Total Conversations Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Conversations
              </h3>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-3xl font-bold">
                  {stats?.totalConversations.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Total conversations
                </p>
              </>
            )}
          </div>

          {/* Total Documents Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Documents
              </h3>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-3xl font-bold">
                  {stats?.totalDocuments.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Medical documents
                </p>
              </>
            )}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Medical Documents
                </h2>
                <p className="text-muted-foreground">
                  Upload and manage medical knowledge base documents
                </p>
              </div>
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </div>
            <DocumentList />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  User Management
                </h2>
                <p className="text-muted-foreground">
                  View and manage user accounts
                </p>
              </div>
            </div>
            <UserList />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Medical Documents
            </DialogTitle>
            <DialogDescription>
              Select files to upload to the medical knowledge base. Supported
              formats: PDF, DOCX ,TXT.
            </DialogDescription>
          </DialogHeader>
          <DocumentUpload />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
