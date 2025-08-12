import { useEffect, useRef, useState, useCallback } from 'react';
import { messageTypes } from '@shared/schema';

export interface ChatMessage {
  id: string;
  content: string;
  isSent: boolean;
  timestamp: number;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'waiting' | 'matched' | 'disconnected_partner';

export function useWebSocket() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');
    setError(null);

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleServerMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error');
      setConnectionStatus('disconnected');
    };
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus('disconnected');
    setMessages([]);
    setIsPartnerTyping(false);
    setUserId(null);
  }, []);

  const sendMessage = useCallback((type: string, data?: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  }, []);

  const handleServerMessage = useCallback((message: any) => {
    switch (message.type) {
      case messageTypes.QUEUE_JOINED:
        setUserId(message.data.userId);
        setConnectionStatus('disconnected');
        break;

      case messageTypes.PARTNER_FOUND:
        setConnectionStatus('matched');
        setMessages([]);
        setIsPartnerTyping(false);
        break;

      case messageTypes.MESSAGE_RECEIVED:
        const receivedMessage: ChatMessage = {
          id: message.data.messageId,
          content: message.data.content,
          isSent: false,
          timestamp: message.data.timestamp
        };
        setMessages(prev => [...prev, receivedMessage]);
        break;

      case messageTypes.PARTNER_TYPING:
        setIsPartnerTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsPartnerTyping(false);
        }, 3000);
        break;

      case messageTypes.PARTNER_STOPPED_TYPING:
        setIsPartnerTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        break;

      case messageTypes.PARTNER_DISCONNECTED:
        setConnectionStatus('disconnected_partner');
        setIsPartnerTyping(false);
        break;

      case messageTypes.QUEUE_LEFT:
        setConnectionStatus('disconnected');
        break;

      case messageTypes.ERROR:
        setError(message.data.message);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  const startChat = useCallback(() => {
    if (!wsRef.current) connect();
    
    setConnectionStatus('waiting');
    sendMessage(messageTypes.JOIN_QUEUE);
  }, [connect, sendMessage]);

  const leaveChat = useCallback(() => {
    sendMessage(messageTypes.LEAVE_CHAT);
    setConnectionStatus('disconnected');
    setMessages([]);
    setIsPartnerTyping(false);
  }, [sendMessage]);

  const findNewPartner = useCallback(() => {
    sendMessage(messageTypes.NEXT_PARTNER);
    setConnectionStatus('waiting');
    setMessages([]);
    setIsPartnerTyping(false);
  }, [sendMessage]);

  const sendChatMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const sentMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      isSent: true,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, sentMessage]);
    
    sendMessage(messageTypes.SEND_MESSAGE, {
      type: messageTypes.SEND_MESSAGE,
      content: content.trim(),
      timestamp: Date.now()
    });
  }, [sendMessage]);

  const startTyping = useCallback(() => {
    sendMessage(messageTypes.TYPING_START);
  }, [sendMessage]);

  const stopTyping = useCallback(() => {
    sendMessage(messageTypes.TYPING_STOP);
  }, [sendMessage]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    connectionStatus,
    messages,
    isPartnerTyping,
    error,
    connect,
    disconnect,
    startChat,
    leaveChat,
    findNewPartner,
    sendChatMessage,
    startTyping,
    stopTyping
  };
}
