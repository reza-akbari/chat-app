import Link from "next/link";
import { memo, useState } from "react";
import { fetchApi } from "../utils/fetchApi";
import { getSavedAuthId, setAuthToken } from "../utils/localAuth";
import { ClientOnly } from "./ClientOnly";

const LoginOrOut = memo(() => {
  const [isLoading, setIsLoading] = useState(false);

  if (getSavedAuthId()) {
    return (
      <button
        type="button"
        disabled={isLoading}
        onClick={(event) => {
          event.preventDefault();

          setIsLoading(true);
          fetchApi("/auth/sign-out", {})
            .then(() => {
              setAuthToken(undefined);
              location.reload();
            })
            .catch(() => {})
            .finally(() => {
              setIsLoading(false);
            });
        }}
      >
        خروج
      </button>
    );
  }
  return (
    <>
      <Link href="/login">ورود</Link>
      <Link href="/register">ثبت نام</Link>
    </>
  );
});

export const AppHeader = memo((): JSX.Element => {
  return (
    <header className="flex gap-3 p-1 bg-sky-500 text-white">
      <Link href="/">صفحه اصلی</Link>
      <div className="grow"></div>
      <ClientOnly>
        <LoginOrOut />
      </ClientOnly>
    </header>
  );
});
