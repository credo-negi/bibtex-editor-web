import { createContext, useContext, useState, useCallback } from 'react';

export interface ToastContextProps {
    nextId: number;
    messages: ToastMessage[];
    addMessage: (message: ToastMessage) => void;
    removeMessage: (id: number) => void;
}

interface ToastProviderProps {
    children: React.ReactNode;
    keepTime?: number;
    duration?: number;
}

export enum ToastType {
    INFO = 'info',
    ERROR = 'error',
    SUCCESS = 'success',
    WARNING = 'warning',
}

export enum ToastState {
    ENTERED = 'entered',
    EXITTING = 'exitting',
    NONE = 'none',
}

export interface ToastMessage {
    type: ToastType;
    text: string;
    id: number;
    state: ToastState;
}

const ToastContext = createContext<ToastContextProps | null>(null);

export const ToastProvider = ({ children, keepTime = 3000, duration = 1000 }: ToastProviderProps) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const [nextId, setNextId] = useState(0);

  const removeMessage = useCallback((id: number) => {
    // id が一致するメッセージの isRemoving を true にする
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, state: ToastState.EXITTING } : msg))
    );
    // duration 後に id が一致するメッセージを削除する
    const timer = setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }, duration);
    return () => clearTimeout(timer);
    }, [duration]);
    
  const addMessage = useCallback((message: ToastMessage) => {
    message.id = message.id || nextId;
    setNextId((prev) => prev + 1);
    setMessages((prev) => [...prev, message]);
    const enterTimer = setTimeout(() => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === message.id ? { ...msg, state: ToastState.ENTERED } : msg))
        );
    }, 300);
    const timer = setTimeout(() => {
      removeMessage(message.id);
    }, keepTime);
    return () => {
        clearTimeout(enterTimer);
        clearTimeout(timer);
    }
  }, [nextId, keepTime, removeMessage]);

  return (
    <ToastContext.Provider value={{ nextId, messages, addMessage, removeMessage }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
