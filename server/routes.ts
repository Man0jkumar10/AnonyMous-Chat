import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";
import { chatStorage } from "./storage";
import { messageTypes, webSocketMessageSchema, chatMessageSchema, type ConnectedUser, type ChatMessageWithSender } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Create WebSocket server on /ws path to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    const userId = randomUUID();
    console.log(`User connected: ${userId}`);

    // Add user to storage
    const user: ConnectedUser = {
      id: userId,
      ws,
      isInQueue: false,
      connectedAt: Date.now()
    };
    chatStorage.addUser(user);

    // Send connection confirmation
    sendMessage(ws, messageTypes.QUEUE_JOINED, { userId });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        const validatedMessage = webSocketMessageSchema.parse(message);
        
        handleWebSocketMessage(userId, validatedMessage);
      } catch (error) {
        console.error('Invalid message format:', error);
        sendMessage(ws, messageTypes.ERROR, { message: 'Invalid message format' });
      }
    });

    ws.on('close', () => {
      console.log(`User disconnected: ${userId}`);
      handleUserDisconnect(userId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      handleUserDisconnect(userId);
    });
  });

  function sendMessage(ws: WebSocket, type: string, data?: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, data }));
    }
  }

  function handleWebSocketMessage(userId: string, message: any) {
    const user = chatStorage.getUser(userId);
    if (!user) return;

    switch (message.type) {
      case messageTypes.JOIN_QUEUE:
        handleJoinQueue(userId);
        break;

      case messageTypes.LEAVE_QUEUE:
        handleLeaveQueue(userId);
        break;

      case messageTypes.SEND_MESSAGE:
        handleSendMessage(userId, message.data);
        break;

      case messageTypes.TYPING_START:
        handleTypingStart(userId);
        break;

      case messageTypes.TYPING_STOP:
        handleTypingStop(userId);
        break;

      case messageTypes.LEAVE_CHAT:
        handleLeaveChat(userId);
        break;

      case messageTypes.NEXT_PARTNER:
        handleNextPartner(userId);
        break;

      default:
        sendMessage(user.ws, messageTypes.ERROR, { message: 'Unknown message type' });
    }
  }

  function handleJoinQueue(userId: string) {
    const user = chatStorage.getUser(userId);
    if (!user) return;

    // Check if there's already someone in queue
    const queuedUserId = chatStorage.getQueuedUser();
    
    if (queuedUserId && queuedUserId !== userId) {
      // Match with queued user
      const queuedUser = chatStorage.getUser(queuedUserId);
      if (queuedUser) {
        const room = chatStorage.createRoom(queuedUserId, userId);
        
        // Notify both users
        sendMessage(queuedUser.ws, messageTypes.PARTNER_FOUND, { roomId: room.id });
        sendMessage(user.ws, messageTypes.PARTNER_FOUND, { roomId: room.id });
        
        console.log(`Room created: ${room.id} with users ${queuedUserId} and ${userId}`);
      }
    } else {
      // Add to queue
      chatStorage.addToQueue(userId);
      console.log(`User ${userId} added to queue`);
    }
  }

  function handleLeaveQueue(userId: string) {
    chatStorage.removeFromQueue(userId);
    const user = chatStorage.getUser(userId);
    if (user) {
      sendMessage(user.ws, messageTypes.QUEUE_LEFT, {});
    }
    console.log(`User ${userId} left queue`);
  }

  function handleSendMessage(userId: string, messageData: any) {
    try {
      const validatedMessage = chatMessageSchema.parse(messageData);
      const room = chatStorage.getRoomByUserId(userId);
      
      if (!room) {
        const user = chatStorage.getUser(userId);
        if (user) {
          sendMessage(user.ws, messageTypes.ERROR, { message: 'Not in a chat room' });
        }
        return;
      }

      // Create message object
      const chatMessage: ChatMessageWithSender = {
        id: randomUUID(),
        content: validatedMessage.content,
        senderId: userId,
        timestamp: Date.now(),
        roomId: room.id
      };

      // Store message temporarily
      chatStorage.addMessage(chatMessage);

      // Send to partner
      const partnerId = room.user1Id === userId ? room.user2Id : room.user1Id;
      const partner = chatStorage.getUser(partnerId);
      
      if (partner) {
        sendMessage(partner.ws, messageTypes.MESSAGE_RECEIVED, {
          content: chatMessage.content,
          timestamp: chatMessage.timestamp,
          messageId: chatMessage.id
        });
      }

      console.log(`Message sent in room ${room.id}: ${validatedMessage.content}`);
    } catch (error) {
      const user = chatStorage.getUser(userId);
      if (user) {
        sendMessage(user.ws, messageTypes.ERROR, { message: 'Invalid message format' });
      }
    }
  }

  function handleTypingStart(userId: string) {
    const room = chatStorage.getRoomByUserId(userId);
    if (!room) return;

    const partnerId = room.user1Id === userId ? room.user2Id : room.user1Id;
    const partner = chatStorage.getUser(partnerId);
    
    if (partner) {
      sendMessage(partner.ws, messageTypes.PARTNER_TYPING, {});
    }
  }

  function handleTypingStop(userId: string) {
    const room = chatStorage.getRoomByUserId(userId);
    if (!room) return;

    const partnerId = room.user1Id === userId ? room.user2Id : room.user1Id;
    const partner = chatStorage.getUser(partnerId);
    
    if (partner) {
      sendMessage(partner.ws, messageTypes.PARTNER_STOPPED_TYPING, {});
    }
  }

  function handleLeaveChat(userId: string) {
    const room = chatStorage.getRoomByUserId(userId);
    if (!room) return;

    const partnerId = room.user1Id === userId ? room.user2Id : room.user1Id;
    const partner = chatStorage.getUser(partnerId);
    
    // Notify partner
    if (partner) {
      sendMessage(partner.ws, messageTypes.PARTNER_DISCONNECTED, {});
    }

    // Remove room
    chatStorage.removeRoom(room.id);
    console.log(`User ${userId} left chat room ${room.id}`);
  }

  function handleNextPartner(userId: string) {
    // Leave current chat first
    handleLeaveChat(userId);
    
    // Then join queue again
    setTimeout(() => {
      handleJoinQueue(userId);
    }, 100);
  }

  function handleUserDisconnect(userId: string) {
    const room = chatStorage.getRoomByUserId(userId);
    
    if (room) {
      const partnerId = room.user1Id === userId ? room.user2Id : room.user1Id;
      const partner = chatStorage.getUser(partnerId);
      
      // Notify partner of disconnection
      if (partner) {
        sendMessage(partner.ws, messageTypes.PARTNER_DISCONNECTED, {});
      }

      // Remove room
      chatStorage.removeRoom(room.id);
    }

    // Remove user from storage
    chatStorage.removeUser(userId);
  }

  return httpServer;
}
