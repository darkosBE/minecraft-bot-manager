import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingToggle } from '@/components/settings/SettingToggle';
import { BotCard } from '@/components/bots/BotCard';
import { AntiAFKModal } from '@/components/modals/AntiAFKModal';
import { JoinMessagesModal } from '@/components/modals/JoinMessagesModal';
import { WorldChangeModal } from '@/components/modals/WorldChangeModal';
import { AutoReconnectModal } from '@/components/modals/AutoReconnectModal';
import { AddBotModal } from '@/components/modals/AddBotModal';
import { useSocketContext } from '@/contexts/SocketContext';
import { 
  getServerInfo, saveServerInfo, ServerInfo,
  getSettings, saveSettings, BotSettings,
  getBots, saveBots, BotAccount
} from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Plug, Unplug, Save, Server, Settings as SettingsIcon, Users } from 'lucide-react';

const MC_VERSIONS = ['1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20', '1.19.4', '1.19.3', '1.19.2', '1.18.2', '1.17.1', '1.16.5'];

export default function ConnectPage() {
  const { botStatuses, connectBot, disconnectBot } = useSocketContext();
  
  const [serverInfo, setServerInfo] = useState<ServerInfo>({
    serverIP: 'localhost',
    serverPort: 25565,
    version: '1.20.1',
    loginDelay: 5
  });
  
  const [settings, setSettings] = useState<BotSettings>({
    offlineMode: false,
    sneak: false,
    botPhysics: true,
    antiAFK: true,
    antiAFKInterval: 1,
    antiAFKPhysical: { forward: true, head: true, arm: false, jump: true },
    antiAFKChat: { message: '/ping', send: false },
    joinMessages: true,
    joinMessageDelay: 2,
    joinMessagesList: ['Hello world'],
    worldChangeMessages: true,
    worldChangeMessageDelay: 5,
    worldChangeMessagesList: ['/home'],
    autoReconnect: true,
    autoReconnectDelay: 4,
    proxies: false,
    fakeHost: false
  });
  
  const [bots, setBots] = useState<BotAccount[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [antiAFKOpen, setAntiAFKOpen] = useState(false);
  const [joinMessagesOpen, setJoinMessagesOpen] = useState(false);
  const [worldChangeOpen, setWorldChangeOpen] = useState(false);
  const [autoReconnectOpen, setAutoReconnectOpen] = useState(false);
  const [addBotOpen, setAddBotOpen] = useState(false);

  useEffect(() => {
    Promise.all([getServerInfo(), getSettings(), getBots()])
      .then(([info, set, bts]) => {
        setServerInfo(info);
        setSettings(set);
        setBots(bts);
      })
      .catch(() => toast.error('Failed to load data from server'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveServerInfo = async () => {
    try {
      await saveServerInfo(serverInfo);
      toast.success('Server info saved');
    } catch {
      toast.error('Failed to save server info');
    }
  };

  const handleSettingChange = async (key: keyof BotSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await saveSettings(newSettings);
    } catch {
      toast.error('Failed to save setting');
    }
  };

  const handleAddBot = async (bot: BotAccount) => {
    const newBots = [...bots, bot];
    setBots(newBots);
    try {
      await saveBots(newBots);
      toast.success('Bot added');
    } catch {
      toast.error('Failed to add bot');
    }
  };

  const handleConnectAll = () => {
    bots.forEach(bot => connectBot(bot.username));
  };

  const handleDisconnectAll = () => {
    bots.forEach(bot => disconnectBot(bot.username));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Connect</h1>
        <p className="text-muted-foreground">Configure server connection and bot settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Information */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="w-5 h-5 text-primary" />
              Server Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Server IP</Label>
                <Input 
                  value={serverInfo.serverIP}
                  onChange={e => setServerInfo(s => ({ ...s, serverIP: e.target.value }))}
                  placeholder="play.example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Port</Label>
                <Input 
                  type="number"
                  value={serverInfo.serverPort}
                  onChange={e => setServerInfo(s => ({ ...s, serverPort: parseInt(e.target.value) || 25565 }))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Version</Label>
                <Select 
                  value={serverInfo.version} 
                  onValueChange={v => setServerInfo(s => ({ ...s, version: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MC_VERSIONS.map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Login Delay (s)</Label>
                <Input 
                  type="number"
                  min={0}
                  value={serverInfo.loginDelay}
                  onChange={e => setServerInfo(s => ({ ...s, loginDelay: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>

            <Button onClick={handleSaveServerInfo} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Server Info
            </Button>
          </CardContent>
        </Card>

        {/* Bot Settings */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Bot Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SettingToggle 
              label="Offline Mode" 
              checked={settings.offlineMode}
              onCheckedChange={v => handleSettingChange('offlineMode', v)}
            />
            <SettingToggle 
              label="Sneak" 
              checked={settings.sneak}
              onCheckedChange={v => handleSettingChange('sneak', v)}
            />
            <SettingToggle 
              label="Bot Physics" 
              checked={settings.botPhysics}
              onCheckedChange={v => handleSettingChange('botPhysics', v)}
            />
            <SettingToggle 
              label="Anti-AFK" 
              checked={settings.antiAFK}
              onCheckedChange={v => handleSettingChange('antiAFK', v)}
              hasConfig
              onConfigClick={() => setAntiAFKOpen(true)}
            />
            <SettingToggle 
              label="Join Messages" 
              checked={settings.joinMessages}
              onCheckedChange={v => handleSettingChange('joinMessages', v)}
              hasConfig
              onConfigClick={() => setJoinMessagesOpen(true)}
            />
            <SettingToggle 
              label="World Change Messages" 
              checked={settings.worldChangeMessages}
              onCheckedChange={v => handleSettingChange('worldChangeMessages', v)}
              hasConfig
              onConfigClick={() => setWorldChangeOpen(true)}
            />
            <SettingToggle 
              label="Auto Reconnect" 
              checked={settings.autoReconnect}
              onCheckedChange={v => handleSettingChange('autoReconnect', v)}
              hasConfig
              onConfigClick={() => setAutoReconnectOpen(true)}
            />
            <SettingToggle 
              label="Proxies" 
              checked={settings.proxies}
              onCheckedChange={v => handleSettingChange('proxies', v)}
            />
            <SettingToggle 
              label="Fake Host" 
              checked={settings.fakeHost}
              onCheckedChange={v => handleSettingChange('fakeHost', v)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Bot Accounts */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              Bot Accounts ({bots.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleConnectAll} disabled={bots.length === 0}>
                <Plug className="w-4 h-4 mr-1" />
                Connect All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDisconnectAll} disabled={bots.length === 0}>
                <Unplug className="w-4 h-4 mr-1" />
                Disconnect All
              </Button>
              <Button size="sm" onClick={() => setAddBotOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Bot
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bots configured. Click "Add Bot" to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bots.map(bot => (
                <BotCard
                  key={bot.username}
                  username={bot.username}
                  status={botStatuses[bot.username]}
                  onConnect={() => connectBot(bot.username)}
                  onDisconnect={() => disconnectBot(bot.username)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AntiAFKModal open={antiAFKOpen} onOpenChange={setAntiAFKOpen} />
      <JoinMessagesModal open={joinMessagesOpen} onOpenChange={setJoinMessagesOpen} />
      <WorldChangeModal open={worldChangeOpen} onOpenChange={setWorldChangeOpen} />
      <AutoReconnectModal open={autoReconnectOpen} onOpenChange={setAutoReconnectOpen} />
      <AddBotModal open={addBotOpen} onOpenChange={setAddBotOpen} onAdd={handleAddBot} />
    </div>
  );
}
