import Head from "next/head";
import { AppLayout } from "../components/AppLayout";
import { AuthForm } from "../components/AuthForm";

export default function Login() {
  return (
    <>
      <Head>
        <title>ورود</title>
      </Head>
      <AppLayout>
        <h1 className="text-xl text-center">ورود به حساب</h1>
        <AuthForm type="sign-in" />
      </AppLayout>
    </>
  );
}
