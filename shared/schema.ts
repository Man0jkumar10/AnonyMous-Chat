import { z } from "zod";

// WebSocket message types
export const messageTypes = {
  // Client to server
  JOIN_QUEUE: 'JOIN_QUEUE',
  LEAVE_QUEUE: 'LEAVE_QUEUE',
  SEND_MESSAGE: 'SEND_MESSAGE',
  TYPING_START: 'TYPING_START',
  TYPING_STOP: 'TYPING_STOP',
  LEAVE_CHAT: 'LEAVE_CHAT',
  NEXT_PARTNER: 'NEXT_PARTNER',
  
  // Server to client
  QUEUE_JOINED: 'QUEUE_JOINED',
  PARTNER_FOUND: 'PARTNER_FOUND',
  MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
  PARTNER_TYPING: 'PARTNER_TYPING',
  PARTNER_STOPPED_TYPING: 'PARTNER_STOPPED_TYPING',
  PARTNER_DISCONNECTED: 'PARTNER_DISCONNECTED',
  QUEUE_LEFT: 'QUEUE_LEFT',
  ERROR: 'ERROR'
} as const;

export type MessageType = typeof messageTypes[keyof typeof messageTypes];

// Message schemas
export const chatMessageSchema = z.object({
  type: z.enum([messageTypes.SEND_MESSAGE]),
  content: z.string().min(1).max(500),
  timestamp: z.number().optional()
});

export const webSocketMessageSchema = z.object({
  type: z.string(),
  data: z.any().optional()
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;

// Chat room and user types
export interface ChatRoom {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: number;
}

export interface ConnectedUser {
  id: string;
  ws: any; // WebSocket connection
  roomId?: string;
  isInQueue: boolean;
  connectedAt: number;
}

export interface ChatMessageWithSender {
  id: string;
  content: string;
  senderId: string;
  timestamp: number;
  roomId: string;
}
