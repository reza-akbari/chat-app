import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { mutate } from "swr";
import { MESSAGES_WS } from "../consts";
import { Message, useMessages } from "../hooks/useMessages";
import { fetchApi } from "../utils/fetchApi";
import { getAuthToken, getSavedAuthId } from "../utils/localAuth";

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

const appendMessages = (messages: Message[]) => {
  mutate(
    "/messages",
    (data: any) => {
      if (!data || !data.messages) {
        return;
      }
      return { ...data, messages: data.messages.concat(messages) };
    },
    { revalidate: false }
  );
};

const LoadMoreBtn = memo(() => {
  const [isFetching, setIsFetching] = useState(false);
  const { data, isLoading } = useMessages();
  const { messages } = data || {};

  const loadMore = () => {
    if (isLoading || isFetching || !messages) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return;
    }

    setIsFetching(true);
    fetchApi(`/messages?before=${lastMessage.id}`, undefined, true)
      .then((data) => {
        appendMessages(data.messages);
      })
      .catch(() => {})
      .finally(() => {
        setIsFetching(false);
      });
  };
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!btn.current || !("IntersectionObserver" in window)) {
      return;
    }
    let isDestroyed = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          if (!isDestroyed) {
            loadMoreRef.current();
          }
        }, 100); // add a delay for better user experience
      }
    });
    observer.observe(btn.current);
    return () => {
      isDestroyed = true;
      observer.disconnect();
    };
  }, []);

  if (!data) return null;

  return (
    <button
      ref={btn}
      type="button"
      className="disabled:opacity-60 px-3 py-1 bg-sky-500 text-white rounded-full text-sm"
      disabled={isLoading || isFetching}
      onClick={(event) => {
        event.preventDefault();
        loadMore();
      }}
    >
      ??????????
    </button>
  );
});

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
  if (error) return <div>??????</div>;
  if (!data) return <div>?????????? ????????????...</div>;

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
      <div className="text-center">
        <LoadMoreBtn />
      </div>
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
        className="disabled:opacity-60 border border-gray-300 rounded-lg py-2 px-3"
        placeholder="???????? ????????..."
        disabled={isLoading}
        name="content"
      />
      <button
        disabled={isLoading}
        className="disabled:opacity-60 bg-sky-500 inline-flex justify-center items-center text-white rounded-full w-10 h-10"
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
        ????????
      </Link>
      <Link
        href="/register"
        className="text-blue-500 border border-blue-500 rounded-lg px-3 py-1"
      >
        ?????? ??????
      </Link>
    </div>
  );
});
