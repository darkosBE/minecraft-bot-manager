import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getApiUrl } from '@/lib/api';

export type BotStatus = 'disconnected' | 'connecting' | 'connected' | 'spawned' | 'kicked' | 'death';

export interface BotStatusEvent {
  botName: string;
  status: BotStatus;
  message: string;
}

export interface BotChatEvent {
  botName: string;
  username: string;
  message: string;
}

export interface BotErrorEvent {
  botName: string;
  error: string;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [botStatuses, setBotStatuses] = useState<Record<string, BotStatusEvent>>({});
  const [chatMessages, setChatMessages] = useState<BotChatEvent[]>([]);

  useEffect(() => {
    const apiUrl = getApiUrl();
    const socket = io(apiUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socket.on('bot-status', (data: BotStatusEvent) => {
      setBotStatuses(prev => ({ ...prev, [data.botName]: data }));
    });

    socket.on('bot-chat', (data: BotChatEvent) => {
      setChatMessages(prev => [...prev.slice(-499), data]);
    });

    socket.on('bot-error', (data: BotErrorEvent) => {
      console.error(`Bot ${data.botName} error:`, data.error);
    });

    socket.on('reconnecting-bot', (data: { botName: string }) => {
      setBotStatuses(prev => ({
        ...prev,
        [data.botName]: { botName: data.botName, status: 'connecting', message: 'Reconnecting...' }
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const connectBot = useCallback((botName: string) => {
    socketRef.current?.emit('connect-bot', { botName });
    setBotStatuses(prev => ({
      ...prev,
      [botName]: { botName, status: 'connecting', message: 'Connecting...' }
    }));
  }, []);

  const disconnectBot = useCallback((botName: string) => {
    socketRef.current?.emit('disconnect-bot', { botName });
  }, []);

  const sendChat = useCallback((botName: string, message: string) => {
    socketRef.current?.emit('send-chat', { botName, message });
  }, []);

  const sendSpam = useCallback((botName: string, message: string, delay: number, enable: boolean) => {
    socketRef.current?.emit('send-spam', { botName, message, delay, enable });
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
  }, []);

  return {
    isConnected,
    botStatuses,
    chatMessages,
    connectBot,
    disconnectBot,
    sendChat,
    sendSpam,
    clearChat,
    reconnect,
  };
}
