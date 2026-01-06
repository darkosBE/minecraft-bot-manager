import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BotAccount } from '@/lib/api';

interface AddBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (bot: BotAccount) => void;
  editBot?: BotAccount | null;
}

export function AddBotModal({ open, onOpenChange, onAdd, editBot }: AddBotModalProps) {
  const [username, setUsername] = useState(editBot?.username || '');
  const [password, setPassword] = useState(editBot?.password || '');

  const handleSubmit = () => {
    if (!username.trim()) return;
    onAdd({ username: username.trim(), password: password || undefined });
    setUsername('');
    setPassword('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle>{editBot ? 'Edit Bot' : 'Add Bot Account'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Bot username"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Password (optional)</Label>
            <Input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="For premium accounts"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Only needed for premium/Microsoft accounts
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!username.trim()}>
              {editBot ? 'Save' : 'Add Bot'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
