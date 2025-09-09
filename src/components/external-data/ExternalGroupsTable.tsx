import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Users, MapPin } from 'lucide-react';
import { ExternalGroup } from '@/hooks/useExternalData';

interface ExternalGroupsTableProps {
  groups: ExternalGroup[];
  onApprove: (groupId: string) => void;
  onReject?: (groupId: string) => void;
  loading?: boolean;
}

export const ExternalGroupsTable: React.FC<ExternalGroupsTableProps> = ({
  groups,
  onApprove,
  onReject,
  loading = false
}) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending_approval: 'outline',
      approved: 'default',
      rejected: 'destructive',
      active: 'default',
      completed: 'secondary'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>External Groups</CardTitle>
          <CardDescription>No external groups found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Upload a file or configure an external data source to generate groups.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          External Groups ({groups.length})
        </CardTitle>
        <CardDescription>
          Groups generated from external data sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Neighborhood</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compatibility</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{group.name}</div>
                      {group.description && (
                        <div className="text-sm text-muted-foreground">
                          {group.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{group.group_size}</span>
                    </div>
                    {group.members && group.members.length > 0 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {group.members.map((member, index) => (
                          <div key={member.id}>
                            {member.mapped_data?.full_name || member.mapped_data?.first_name || `Member ${index + 1}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {group.neighborhood_id ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">Assigned</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No neighborhood</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(group.status)}
                  </TableCell>
                  <TableCell>
                    {group.compatibility_score ? (
                      <div className="text-sm">
                        {Math.round(group.compatibility_score * 100)}%
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(group.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {group.status === 'pending_approval' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApprove(group.id)}
                            disabled={loading}
                            className="h-8 px-2"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          {onReject && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onReject(group.id)}
                              disabled={loading}
                              className="h-8 px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </>
                      )}
                      {group.status === 'approved' && (
                        <Badge variant="default" className="text-xs">
                          Approved
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};