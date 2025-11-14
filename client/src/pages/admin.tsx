import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Users, Home, Briefcase, Plus, Ban } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface AdminStats {
  totalUsers: number;
  homeownerCount: number;
  contractorCount: number;
  topSearches: Array<{ searchTerm: string; count: number }>;
  signupsByZip: Array<{ zipCode: string; count: number }>;
}

interface SearchAnalytic {
  id: string;
  userId: string | null;
  searchTerm: string;
  serviceType: string | null;
  userZipCode: string | null;
  searchContext: string | null;
  createdAt: Date | null;
}

interface InviteCode {
  id: string;
  code: string;
  createdBy: string | null;
  usedBy: string[];
  isActive: boolean;
  maxUses: number;
  currentUses: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [maxUses, setMaxUses] = useState("1");

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  // Fetch search analytics (last 50)
  const { data: recentSearches, isLoading: searchesLoading } = useQuery<SearchAnalytic[]>({
    queryKey: ["/api/admin/search-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/search-analytics?limit=50", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch search analytics");
      return res.json();
    },
  });

  // Fetch invite codes
  const { data: inviteCodes, isLoading: codesLoading } = useQuery<InviteCode[]>({
    queryKey: ["/api/admin/invite-codes"],
  });

  // Create invite code mutation
  const createCodeMutation = useMutation({
    mutationFn: async (data: { code: string; maxUses: number }) => {
      return apiRequest("/api/admin/invite-codes", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invite-codes"] });
      setIsDialogOpen(false);
      setNewCode("");
      setMaxUses("1");
      toast({
        title: "Success",
        description: "Invite code created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invite code",
        variant: "destructive",
      });
    },
  });

  // Deactivate invite code mutation
  const deactivateCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiRequest(`/api/admin/invite-codes/${code}/deactivate`, "PATCH", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invite-codes"] });
      toast({
        title: "Success",
        description: "Invite code deactivated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate invite code",
        variant: "destructive",
      });
    },
  });

  const handleCreateCode = () => {
    if (!newCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a code",
        variant: "destructive",
      });
      return;
    }

    const maxUsesNum = parseInt(maxUses);
    if (isNaN(maxUsesNum) || maxUsesNum < 1) {
      toast({
        title: "Error",
        description: "Max uses must be a positive number",
        variant: "destructive",
      });
      return;
    }

    createCodeMutation.mutate({ code: newCode.trim(), maxUses: maxUsesNum });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-admin-title">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, analytics, and invite codes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-total-users">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-total-users">{stats?.totalUsers || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-homeowner-count">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Homeowners</CardTitle>
              <Home className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-homeowner-count">{stats?.homeownerCount || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-contractor-count">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Contractors</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-contractor-count">{stats?.contractorCount || 0}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Searches */}
          <Card data-testid="card-top-searches">
            <CardHeader>
              <CardTitle>Top Search Terms</CardTitle>
              <CardDescription>Most searched terms by users</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Search Term</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.topSearches && stats.topSearches.length > 0 ? (
                      stats.topSearches.slice(0, 10).map((search, index) => (
                        <TableRow key={index} data-testid={`row-search-${index}`}>
                          <TableCell data-testid={`text-search-term-${index}`}>{search.searchTerm}</TableCell>
                          <TableCell className="text-right" data-testid={`text-search-count-${index}`}>{search.count}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-gray-500">
                          No search data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Signups by Zip Code */}
          <Card data-testid="card-signups-by-zip">
            <CardHeader>
              <CardTitle>Signups by Zip Code</CardTitle>
              <CardDescription>Top locations by user signups</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zip Code</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.signupsByZip && stats.signupsByZip.length > 0 ? (
                      stats.signupsByZip.slice(0, 10).map((signup, index) => (
                        <TableRow key={index} data-testid={`row-zip-${index}`}>
                          <TableCell data-testid={`text-zip-code-${index}`}>{signup.zipCode}</TableCell>
                          <TableCell className="text-right" data-testid={`text-zip-count-${index}`}>{signup.count}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-gray-500">
                          No signup data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Searches Timeline */}
        <Card className="mb-8" data-testid="card-recent-searches">
          <CardHeader>
            <CardTitle>Recent Searches</CardTitle>
            <CardDescription>Last 50 searches from users</CardDescription>
          </CardHeader>
          <CardContent>
            {searchesLoading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Search Term</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Zip Code</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSearches && recentSearches.length > 0 ? (
                      recentSearches.map((search, index) => (
                        <TableRow key={search.id} data-testid={`row-recent-search-${index}`}>
                          <TableCell data-testid={`text-recent-term-${index}`}>{search.searchTerm}</TableCell>
                          <TableCell data-testid={`text-recent-service-${index}`}>
                            {search.serviceType || <span className="text-gray-400">-</span>}
                          </TableCell>
                          <TableCell data-testid={`text-recent-zip-${index}`}>
                            {search.userZipCode || <span className="text-gray-400">-</span>}
                          </TableCell>
                          <TableCell data-testid={`text-recent-time-${index}`}>
                            {search.createdAt ? format(new Date(search.createdAt), "MMM d, yyyy h:mm a") : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          No recent searches
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invite Code Management */}
        <Card data-testid="card-invite-codes">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invite Codes</CardTitle>
                <CardDescription>Manage invite codes for user registration</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-code">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Invite Code</DialogTitle>
                    <DialogDescription>
                      Generate a new invite code for user registration
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code">Code</Label>
                      <Input
                        id="code"
                        data-testid="input-code"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="e.g., WELCOME2025"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxUses">Max Uses</Label>
                      <Input
                        id="maxUses"
                        data-testid="input-max-uses"
                        type="number"
                        min="1"
                        value={maxUses}
                        onChange={(e) => setMaxUses(e.target.value)}
                        placeholder="1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-code"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCode}
                      disabled={createCodeMutation.isPending}
                      data-testid="button-submit-code"
                    >
                      {createCodeMutation.isPending ? "Creating..." : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {codesLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Max Uses</TableHead>
                      <TableHead>Current Uses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inviteCodes && inviteCodes.length > 0 ? (
                      inviteCodes.map((code, index) => (
                        <TableRow key={code.id} data-testid={`row-code-${index}`}>
                          <TableCell className="font-mono" data-testid={`text-code-${index}`}>{code.code}</TableCell>
                          <TableCell data-testid={`text-max-uses-${index}`}>{code.maxUses}</TableCell>
                          <TableCell data-testid={`text-current-uses-${index}`}>{code.currentUses}</TableCell>
                          <TableCell data-testid={`badge-status-${index}`}>
                            <Badge variant={code.isActive ? "default" : "secondary"}>
                              {code.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`text-created-${index}`}>
                            {code.createdAt ? format(new Date(code.createdAt), "MMM d, yyyy") : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {code.isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deactivateCodeMutation.mutate(code.code)}
                                disabled={deactivateCodeMutation.isPending}
                                data-testid={`button-deactivate-${index}`}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Deactivate
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          No invite codes found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
