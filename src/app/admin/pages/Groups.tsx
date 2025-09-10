import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Users } from "lucide-react";
import { useActivityGroups } from "@/hooks/useActivityGroups";
import { getActivityTypeLabel } from "@/lib/activityTypes";
import { format } from "date-fns";

export default function AdminGroups() {
  const { listGroupsWithFallback } = useActivityGroups();
  const { data: groups = [], isLoading, error } = listGroupsWithFallback();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Groups</h1>
        </div>
        <div className="text-center py-8">Loading groups...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Groups</h1>
        </div>
        <div className="text-center py-8 text-destructive">
          Error loading groups: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">
            Manage activity groups and legacy data
          </p>
        </div>
        <Link to="/admin2/groups/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Group
          </Button>
        </Link>
      </div>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Groups ({groups.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No groups yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first group to get started
              </p>
              <Link to="/admin2/groups/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group: any) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div className="font-medium">{group.name}</div>
                      {group.description && (
                        <div className="text-sm text-muted-foreground">
                          {group.description.length > 50 
                            ? `${group.description.slice(0, 50)}...`
                            : group.description
                          }
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getActivityTypeLabel(group.activity_type)}</span>
                        {group._fallback && (
                          <Badge variant="outline" className="text-xs">
                            legacy
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={group.status === 'active' ? 'default' : 'secondary'}
                      >
                        {group.status || 'draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {group.max_members ? `0 / ${group.max_members}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {group.created_at 
                        ? format(new Date(group.created_at), 'MMM d, yyyy')
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      {!group._fallback ? (
                        <Link to={`/admin2/groups/${group.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Legacy data
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}