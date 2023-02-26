import Head from "next/head";
import { AppLayout } from "../components/AppLayout";
import { ClientOnly } from "../components/ClientOnly";
import { Messages } from "../components/Messages";

export default function Home() {
  const title = "پروژه آموزشی چت آنلاین";
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <AppLayout>
        <h1 className="text-center text-lg font-bold mb-4">{title}</h1>
        <ClientOnly>
          <Messages />
        </ClientOnly>
      </AppLayout>
    </>
  );
}
