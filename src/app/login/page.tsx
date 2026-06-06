import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8">
        <h1 className="text-lg font-semibold tracking-normal text-zinc-950">AI DevOS</h1>
        <p className="mt-2 text-sm text-zinc-500">Enter the admin password to continue.</p>
        <LoginForm />
      </div>
    </div>
  );
}
