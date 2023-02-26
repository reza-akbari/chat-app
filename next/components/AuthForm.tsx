import { useRouter } from "next/router";
import { memo, useRef, useState } from "react";
import { fetchApi } from "../utils/fetchApi";
import { setAuthToken } from "../utils/localAuth";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

export const AuthForm = memo(({ type }: AuthFormProps) => {
  const nameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      className="flex flex-col items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (isLoading) {
          return;
        }

        setIsLoading(true);
        fetchApi("/auth/" + type, {
          name: nameInput.current?.value,
          password: passwordInput.current?.value,
        })
          .then(({ accessToken }) => {
            setAuthToken(accessToken);
            router.push("/");
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-gray-500 text-sm">نام:</span>
        <input
          className="p-2 border border-gray-300 rounded-lg"
          ref={nameInput}
          disabled={isLoading}
          name="name"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-gray-500 text-sm">کلمه عبور:</span>
        <input
          className="p-2 border border-gray-300 rounded-lg"
          ref={passwordInput}
          disabled={isLoading}
          type="password"
          name="password"
        />
      </label>
      <button
        className="px-4 py-2 bg-sky-500 text-white rounded-lg"
        disabled={isLoading}
      >
        {type === "sign-in" ? "ورود" : "ثبت نام"}
      </button>
    </form>
  );
});
