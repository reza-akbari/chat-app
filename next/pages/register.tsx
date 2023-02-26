import Head from "next/head";
import { AppLayout } from "../components/AppLayout";
import { AuthForm } from "../components/AuthForm";

export default function Login() {
  return (
    <>
      <Head>
        <title>ثبت نام</title>
      </Head>
      <AppLayout>
        <h1 className="text-xl text-center">ساخت حساب جدید</h1>
        <AuthForm type="sign-up" />
      </AppLayout>
    </>
  );
}
