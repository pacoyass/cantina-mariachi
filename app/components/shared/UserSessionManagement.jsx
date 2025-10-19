import { useState } from 'react';
import { useSubmit } from 'react-router';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Monitor, Smartphone, Power } from '../../lib/lucide-shim.js';
import { parseUserAgent, formatRelativeTime } from '../../lib/session-utils';

export function UserSessionManagement({ usersData, currentUser }) {
  const submit = useSubmit();
  const [selectedSessions, setSelectedSessions] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = usersData.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSessionSelect = (userId, sessionId) => {
    const key = `${userId}-${sessionId}`;
    const newSelected = new Set(selectedSessions);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedSessions(newSelected);
  };

  const handleRevokeSelected = () => {
    if (selectedSessions.size === 0) return;
    
    if (confirm(`Revoke ${selectedSessions.size} selected sessions?`)) {
      selectedSessions.forEach(key => {
        const [userId, sessionId] = key.split('-');
        const formData = new FormData();
        formData.append("intent", "revoke-user-session");
        formData.append("userId", userId);
        formData.append("sessionId", sessionId);
        submit(formData, { method: "post", action: "/account" });
      });
      setSelectedSessions(new Set());
    }
  };
 
  return (
    <div className="w-full h-full space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-wrap items-start sm:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-sm"
          />
          <Badge variant="outline" className="text-xs sm:text-sm">
            {filteredUsers.length} users
          </Badge>
        </div>
        
        {selectedSessions.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRevokeSelected}
            className="text-xs sm:text-sm w-full sm:w-auto"
          >
            Revoke {selectedSessions.size} Selected Sessions
          </Button>
        )}
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map(user => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarFallback className="text-xs sm:text-sm">
                      {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{user.name || 'Unknown User'}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={user.id === currentUser?.id ? 'default' : 'secondary'} className="text-xs">
                    {user.role}
                  </Badge>
                  {user.id === currentUser?.id && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {user.sessions?.length || 0} active sessions
                </div>
              </div>
            </CardHeader>
            
            {user.sessions && user.sessions.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {user.sessions.map(session => {
                    const { device, browser } = parseUserAgent(session.userAgent);
                    const sessionKey = `${user.id}-${session.id}`;
                    const isSelected = selectedSessions.has(sessionKey);
                    
                    return (
                      <div 
                        key={session.id}
                        className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border ${
                          isSelected ? 'border-red-200 bg-red-50' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSessionSelect(user.id, session.id)}
                            className="h-4 w-4 flex-shrink-0"
                          />
                          
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {device === "Mobile" ? (
                              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className="font-medium text-xs sm:text-sm truncate">{device} • {browser}</span>
                          </div>
                          
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            IP: {session.ip}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="whitespace-nowrap">Active: {formatRelativeTime(session.lastUsedAt)}</span>
                          <span className="whitespace-nowrap">Expires: {formatRelativeTime(session.expiresAt, true)}</span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Revoke this session for ${user.name}?`)) {
                                const formData = new FormData();
                                formData.append("intent", "revoke-user-session");
                                formData.append("userId", user.id);
                                formData.append("sessionId", session.id);
                                submit(formData, { method: "post", action: "/account" });
                              }
                            }}
                            className="text-red-600 hover:text-red-700 text-xs w-full sm:w-auto"
                          >
                            <Power className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Revoke
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
