import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiUrl, setApiUrl, testConnection } from '@/lib/api';
import { useSocketContext } from '@/contexts/SocketContext';
import { toast } from 'sonner';
import { Settings, Server, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { isConnected, reconnect } = useSocketContext();
  const [apiUrl, setApiUrlState] = useState(getApiUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleSaveUrl = () => {
    setApiUrl(apiUrl);
    toast.success('API URL saved. Reconnecting...');
    setTestResult(null);
    // Force page reload to reinitialize socket with new URL
    window.location.reload();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Temporarily set the URL for testing
    const originalUrl = getApiUrl();
    setApiUrl(apiUrl);
    
    try {
      const success = await testConnection();
      setTestResult(success);
      if (success) {
        toast.success('Connection successful!');
      } else {
        toast.error('Connection failed');
        setApiUrl(originalUrl); // Restore original if test fails
      }
    } catch {
      setTestResult(false);
      toast.error('Connection failed');
      setApiUrl(originalUrl);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your AFK Console Client</p>
      </div>

      {/* Backend Connection */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Server className="w-5 h-5 text-primary" />
            Backend Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isConnected ? "bg-primary animate-pulse" : "bg-destructive"
              )} />
              <div>
                <p className="font-medium text-foreground">Socket Status</p>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected to backend' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reconnect}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Reconnect
            </Button>
          </div>

          {/* API URL */}
          <div>
            <Label>Backend API URL</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                value={apiUrl}
                onChange={e => {
                  setApiUrlState(e.target.value);
                  setTestResult(null);
                }}
                placeholder="http://your-server:1043"
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={testing}
              >
                {testing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Test'
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the URL of your Node.js backend server (e.g., http://192.168.1.100:1043)
            </p>
          </div>

          {/* Test Result */}
          {testResult !== null && (
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-lg",
              testResult ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            )}>
              {testResult ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Connection successful!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span>Connection failed. Check the URL and ensure the backend is running.</span>
                </>
              )}
            </div>
          )}

          <Button onClick={handleSaveUrl} className="w-full">
            Save & Reconnect
          </Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-primary" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Application:</span> AFK Console Client</p>
            <p><span className="text-muted-foreground">Version:</span> 1.0.0</p>
            <p><span className="text-muted-foreground">Backend Port:</span> 1043</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
