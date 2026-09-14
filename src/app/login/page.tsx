import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            CM
          </div>
          <h1 className="text-lg font-semibold text-slate-900">
            ClubMatch admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage clubs, players, and sourcing.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
