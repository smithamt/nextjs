"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import "../index.css";

import { useToast } from "@/components/ui/use-toast";
import { Socket } from "socket.io";
import io from "socket.io-client";
import { useHasUser } from "./hasuser.context";

const SocketContext = createContext<Socket | undefined>(undefined);

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("Socket Provide not found");
  return context;
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<any>();
  const { user } = useHasUser();
  const { toast } = useToast();

  useEffect(() => {
    const domain = "http://172.16.20.61:3003";
    if (!domain) return;
    const newSocket = io(domain, { query: { id: user._id } });
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("notification", (data: any) => {
      toast({
        title: "New Notification",
        description: <pre>{JSON.stringify(data, null, 2)}</pre>,
      });
    });
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
