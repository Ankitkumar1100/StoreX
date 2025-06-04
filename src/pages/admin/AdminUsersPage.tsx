import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';
import Button from '../../components/ui/Button';
import { User, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  username: string;
  created_at: string;
  is_admin: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setUpdatingUser(userId);

      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_admin: !currentStatus }
          : user
      ));

      toast.success(`User ${currentStatus ? 'removed from' : 'added to'} administrators`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user status');
    } finally {
      setUpdatingUser(null);
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 rounded-lg">
        <h2 className="text-lg font-semibold text-red-300">Error</h2>
        <p className="mt-2 text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-gray-400">
          Manage user accounts and permissions
        </p>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-800 rounded"></div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-4 text-gray-400 font-medium">User</th>
                    <th className="pb-4 text-gray-400 font-medium">Joined</th>
                    <th className="pb-4 text-gray-400 font-medium">Status</th>
                    <th className="pb-4 text-gray-400 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700/50">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-300" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.username}</div>
                            <div className="text-sm text-gray-400">{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-300">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_admin 
                            ? 'bg-blue-900/20 text-blue-400' 
                            : 'bg-gray-800 text-gray-300'
                        }`}>
                          {user.is_admin ? 'Administrator' : 'User'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          size="sm"
                          variant={user.is_admin ? 'danger' : 'secondary'}
                          onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                          isLoading={updatingUser === user.id}
                          leftIcon={user.is_admin ? <X className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        >
                          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-white">No users found</h3>
              <p className="mt-1 text-gray-400">
                Start by inviting users to your platform.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}