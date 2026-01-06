import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Plus, AlertCircle } from 'lucide-react';

export default function ProxiesPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Proxies</h1>
        <p className="text-muted-foreground">Configure proxy servers for your bots</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-primary" />
              Proxy Servers
            </CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Proxy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Proxy Feature</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              This feature allows you to route bot connections through proxy servers. 
              Enable "Proxies" in the Connect page settings to use this feature.
            </p>
          </div>

          {/* Placeholder for proxy list */}
          <div className="mt-6 p-4 rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground mb-3">Add proxy in format: host:port or host:port:user:pass</p>
            <div className="flex gap-2">
              <Input placeholder="127.0.0.1:8080" className="flex-1" />
              <Button>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
