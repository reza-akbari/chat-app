import useSWR from "swr";
import { fetchApi } from "../utils/fetchApi";

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string };
}

export const useMessages = () =>
  useSWR<{ messages: Message[] }>(
    "/messages",
    (route) => fetchApi(route, undefined, true),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
