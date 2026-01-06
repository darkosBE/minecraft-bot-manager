import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBots, BotAccount } from '@/lib/api';
import { useSocketContext } from '@/contexts/SocketContext';
import { Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronsUp, Hand } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MovementPage() {
  const { sendChat, botStatuses } = useSocketContext();
  const [bots, setBots] = useState<BotAccount[]>([]);
  const [selectedBot, setSelectedBot] = useState<string>('');

  useEffect(() => {
    getBots().then(setBots).catch(() => {});
  }, []);

  const isConnected = selectedBot && 
    (botStatuses[selectedBot]?.status === 'connected' || 
     botStatuses[selectedBot]?.status === 'spawned');

  // These would need backend support for actual movement control
  // For now they're placeholders showing the UI
  const handleMove = (direction: string) => {
    if (!selectedBot || !isConnected) return;
    console.log(`Move ${selectedBot}: ${direction}`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Movement</h1>
        <p className="text-muted-foreground">Control bot movement manually</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Move className="w-5 h-5 text-primary" />
            Movement Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bot Selection */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Select Bot</label>
            <Select value={selectedBot} onValueChange={setSelectedBot}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Choose a bot to control" />
              </SelectTrigger>
              <SelectContent>
                {bots.map(bot => (
                  <SelectItem key={bot.username} value={bot.username}>
                    {bot.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBot && !isConnected && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
              Bot is not connected. Connect the bot first to use movement controls.
            </div>
          )}

          {/* Movement Pad */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Direction Controls</p>
            
            <div className="grid grid-cols-3 gap-2 w-fit">
              <div /> {/* Empty cell */}
              <Button 
                variant="secondary" 
                size="lg"
                className="w-16 h-16"
                disabled={!isConnected}
                onClick={() => handleMove('forward')}
              >
                <ArrowUp className="w-6 h-6" />
              </Button>
              <div /> {/* Empty cell */}
              
              <Button 
                variant="secondary" 
                size="lg"
                className="w-16 h-16"
                disabled={!isConnected}
                onClick={() => handleMove('left')}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="w-16 h-16"
                disabled={!isConnected}
                onClick={() => handleMove('stop')}
              >
                <Hand className="w-6 h-6" />
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="w-16 h-16"
                disabled={!isConnected}
                onClick={() => handleMove('right')}
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
              
              <div /> {/* Empty cell */}
              <Button 
                variant="secondary" 
                size="lg"
                className="w-16 h-16"
                disabled={!isConnected}
                onClick={() => handleMove('back')}
              >
                <ArrowDown className="w-6 h-6" />
              </Button>
              <div /> {/* Empty cell */}
            </div>

            {/* Jump button */}
            <Button 
              variant="default" 
              size="lg"
              className="w-full max-w-[200px] h-12"
              disabled={!isConnected}
              onClick={() => handleMove('jump')}
            >
              <ChevronsUp className="w-5 h-5 mr-2" />
              Jump
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Note: Movement controls require the bot to be connected and spawned in the world.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
