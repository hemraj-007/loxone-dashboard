declare module 'lxcommunicator' {
    // Add any specific types you need or use 'any' for general usage
    export class LXWebSocket {
      open(url: string, username: string, password: string): Promise<void>;
      send(command: string): Promise<{ value: boolean }>;
    }
  }
  