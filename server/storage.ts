import { type ConnectedUser, type ChatRoom, type ChatMessageWithSender } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IChatStorage {
  // User management
  addUser(user: ConnectedUser): void;
  removeUser(userId: string): void;
  getUser(userId: string): ConnectedUser | undefined;
  getAllUsers(): ConnectedUser[];
  
  // Queue management
  addToQueue(userId: string): void;
  removeFromQueue(userId: string): void;
  getQueuedUser(): string | undefined;
  isUserInQueue(userId: string): boolean;
  
  // Room management
  createRoom(user1Id: string, user2Id: string): ChatRoom;
  removeRoom(roomId: string): void;
  getRoom(roomId: string): ChatRoom | undefined;
  getRoomByUserId(userId: string): ChatRoom | undefined;
  
  // Message management (temporary in-memory storage)
  addMessage(message: ChatMessageWithSender): void;
  getRoomMessages(roomId: string): ChatMessageWithSender[];
  clearRoomMessages(roomId: string): void;
}

export class MemChatStorage implements IChatStorage {
  private users: Map<string, ConnectedUser> = new Map();
  private queue: string[] = [];
  private rooms: Map<string, ChatRoom> = new Map();
  private messages: Map<string, ChatMessageWithSender[]> = new Map();

  // User management
  addUser(user: ConnectedUser): void {
    this.users.set(user.id, user);
  }

  removeUser(userId: string): void {
    this.users.delete(userId);
    this.removeFromQueue(userId);
  }

  getUser(userId: string): ConnectedUser | undefined {
    return this.users.get(userId);
  }

  getAllUsers(): ConnectedUser[] {
    return Array.from(this.users.values());
  }

  // Queue management
  addToQueue(userId: string): void {
    if (!this.queue.includes(userId)) {
      this.queue.push(userId);
      const user = this.getUser(userId);
      if (user) {
        user.isInQueue = true;
      }
    }
  }

  removeFromQueue(userId: string): void {
    const index = this.queue.indexOf(userId);
    if (index > -1) {
      this.queue.splice(index, 1);
      const user = this.getUser(userId);
      if (user) {
        user.isInQueue = false;
      }
    }
  }

  getQueuedUser(): string | undefined {
    return this.queue.length > 0 ? this.queue[0] : undefined;
  }

  isUserInQueue(userId: string): boolean {
    return this.queue.includes(userId);
  }

  // Room management
  createRoom(user1Id: string, user2Id: string): ChatRoom {
    const roomId = randomUUID();
    const room: ChatRoom = {
      id: roomId,
      user1Id,
      user2Id,
      createdAt: Date.now()
    };
    
    this.rooms.set(roomId, room);
    
    // Update users' room assignment
    const user1 = this.getUser(user1Id);
    const user2 = this.getUser(user2Id);
    
    if (user1) {
      user1.roomId = roomId;
      user1.isInQueue = false;
    }
    if (user2) {
      user2.roomId = roomId;
      user2.isInQueue = false;
    }
    
    // Remove users from queue
    this.removeFromQueue(user1Id);
    this.removeFromQueue(user2Id);
    
    return room;
  }

  removeRoom(roomId: string): void {
    const room = this.getRoom(roomId);
    if (room) {
      // Clear users' room assignment
      const user1 = this.getUser(room.user1Id);
      const user2 = this.getUser(room.user2Id);
      
      if (user1) {
        user1.roomId = undefined;
      }
      if (user2) {
        user2.roomId = undefined;
      }
      
      // Clear room messages
      this.clearRoomMessages(roomId);
      
      // Remove room
      this.rooms.delete(roomId);
    }
  }

  getRoom(roomId: string): ChatRoom | undefined {
    return this.rooms.get(roomId);
  }

  getRoomByUserId(userId: string): ChatRoom | undefined {
    const user = this.getUser(userId);
    if (user?.roomId) {
      return this.getRoom(user.roomId);
    }
    return undefined;
  }

  // Message management
  addMessage(message: ChatMessageWithSender): void {
    if (!this.messages.has(message.roomId)) {
      this.messages.set(message.roomId, []);
    }
    this.messages.get(message.roomId)!.push(message);
  }

  getRoomMessages(roomId: string): ChatMessageWithSender[] {
    return this.messages.get(roomId) || [];
  }

  clearRoomMessages(roomId: string): void {
    this.messages.delete(roomId);
  }
}

export const chatStorage = new MemChatStorage();
