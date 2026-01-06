// API Service for AFK Console Client

const API_URL_KEY = 'afk-console-api-url';
const DEFAULT_API_URL = 'http://localhost:1043';

export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL;
  }
  return DEFAULT_API_URL;
}

export function setApiUrl(url: string): void {
  localStorage.setItem(API_URL_KEY, url);
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// Server Info
export interface ServerInfo {
  serverIP: string;
  serverPort: number;
  version: string;
  loginDelay: number;
}

export const getServerInfo = () => fetchApi<ServerInfo>('/api/info');
export const saveServerInfo = (info: ServerInfo) => 
  fetchApi<{ success: boolean }>('/api/info', { method: 'POST', body: JSON.stringify(info) });

// Settings
export interface BotSettings {
  offlineMode: boolean;
  sneak: boolean;
  botPhysics: boolean;
  antiAFK: boolean;
  antiAFKInterval: number;
  antiAFKPhysical: {
    forward: boolean;
    head: boolean;
    arm: boolean;
    jump: boolean;
  };
  antiAFKChat: {
    message: string;
    send: boolean;
  };
  joinMessages: boolean;
  joinMessageDelay: number;
  joinMessagesList: string[];
  worldChangeMessages: boolean;
  worldChangeMessageDelay: number;
  worldChangeMessagesList: string[];
  autoReconnect: boolean;
  autoReconnectDelay: number;
  proxies: boolean;
  fakeHost: boolean;
}

export const getSettings = () => fetchApi<BotSettings>('/api/settings');
export const saveSettings = (settings: BotSettings) => 
  fetchApi<{ success: boolean }>('/api/settings', { method: 'POST', body: JSON.stringify(settings) });

// Bots
export interface BotAccount {
  username: string;
  password?: string;
}

export const getBots = () => fetchApi<BotAccount[]>('/api/bots');
export const saveBots = (bots: BotAccount[]) => 
  fetchApi<{ success: boolean }>('/api/bots', { method: 'POST', body: JSON.stringify(bots) });

// Modal Configs
export interface AntiAFKConfig {
  interval: number;
  physical: {
    forward: boolean;
    head: boolean;
    arm: boolean;
    jump: boolean;
  };
  chat: {
    message: string;
    send: boolean;
  };
}

export const getAntiAFKConfig = () => fetchApi<AntiAFKConfig>('/api/anti-afk-config');
export const saveAntiAFKConfig = (config: AntiAFKConfig) => 
  fetchApi<{ success: boolean }>('/api/anti-afk-config', { method: 'POST', body: JSON.stringify(config) });

export interface JoinMessagesConfig {
  delay: number;
  messages: string[];
}

export const getJoinMessagesConfig = () => fetchApi<JoinMessagesConfig>('/api/join-messages-config');
export const saveJoinMessagesConfig = (config: JoinMessagesConfig) => 
  fetchApi<{ success: boolean }>('/api/join-messages-config', { method: 'POST', body: JSON.stringify(config) });

export interface WorldChangeConfig {
  delay: number;
  messages: string[];
}

export const getWorldChangeConfig = () => fetchApi<WorldChangeConfig>('/api/world-change-messages-config');
export const saveWorldChangeConfig = (config: WorldChangeConfig) => 
  fetchApi<{ success: boolean }>('/api/world-change-messages-config', { method: 'POST', body: JSON.stringify(config) });

export interface AutoReconnectConfig {
  delay: number;
}

export const getAutoReconnectConfig = () => fetchApi<AutoReconnectConfig>('/api/autoreconnect-config');
export const saveAutoReconnectConfig = (config: AutoReconnectConfig) => 
  fetchApi<{ success: boolean }>('/api/autoreconnect-config', { method: 'POST', body: JSON.stringify(config) });

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    await getServerInfo();
    return true;
  } catch {
    return false;
  }
}
