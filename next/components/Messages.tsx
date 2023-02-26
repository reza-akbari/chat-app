import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { mutate } from "swr";
import { MESSAGES_WS } from "../consts";
import { useMessages } from "../hooks/useMessages";
import { fetchApi } from "../utils/fetchApi";
import { getAuthToken, getSavedAuthId } from "../utils/localAuth";

interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string };
}

const addNewMessage = (message: Message) => {
  mutate(
    "/messages",
    (data: any) => {
      if (!data || !data.messages) {
        return;
      }
      return { ...data, messages: [message, ...data.messages] };
    },
    { revalidate: false }
  );
};

const MessagesList = memo(() => {
  useEffect(() => {
    let isDestroyed = false;
    let socket: WebSocket | undefined = undefined;
    (async () => {
      const token = await getAuthToken();
      if (isDestroyed || !token) {
        return;
      }
      socket = new WebSocket(MESSAGES_WS + "/" + token);
      socket.addEventListener("message", ({ data }) => {
        addNewMessage(JSON.parse(data));
      });
    })();
    return () => {
      isDestroyed = true;
      socket?.close();
    };
  }, []);

  const { data, error } = useMessages();
  if (error) return <div>خطا</div>;
  if (!data) return <div>درحال دریافت...</div>;

  return (
    <div className="h-[70vh] overflow-auto flex flex-col-reverse gap-3">
      {data.messages.map((message: Message) => (
        <div key={message.id} className="p-2 rounded-lg bg-gray-100">
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">{message.user.name}</div>
            <div className="text-xs text-gray-400">{message.createdAt}</div>
          </div>
          <div className="p-1 leading-6">{message.content}</div>
        </div>
      ))}
    </div>
  );
});

const NewMessageForm = memo(() => {
  const contentInput = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      className="flex gap-2 items-center"
      onSubmit={(event) => {
        event.preventDefault();
        if (isLoading) {
          return;
        }

        setIsLoading(true);
        fetchApi(
          "/messages/new",
          { content: contentInput.current?.value },
          true
        )
          .then(() => {
            if (contentInput.current) {
              contentInput.current.value = "";
            }
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      }}
    >
      <input
        ref={contentInput}
        className="border border-gray-300 rounded-lg py-2 px-3"
        placeholder="پیام جدید..."
        disabled={isLoading}
        name="content"
      />
      <button
        disabled={isLoading}
        className="bg-sky-500 inline-flex justify-center items-center text-white rounded-full w-10 h-10"
      >
        <IoSend className="-scale-x-100 text-xl" />
      </button>
    </form>
  );
});

export const Messages = memo(() => {
  if (getSavedAuthId()) {
    return (
      <>
        <MessagesList />
        <div className="py-1"></div>
        <NewMessageForm />
      </>
    );
  }

  return (
    <div className="flex h-[15vh] gap-2 items-center justify-center">
      <Link
        href="/login"
        className="text-blue-500 border border-blue-500 rounded-lg px-3 py-1"
      >
        ورود
      </Link>
      <Link
        href="/register"
        className="text-blue-500 border border-blue-500 rounded-lg px-3 py-1"
      >
        ثبت نام
      </Link>
    </div>
  );
});
