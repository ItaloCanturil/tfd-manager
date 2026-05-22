"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAccessToken } from "../../lib/auth-session";
import { apiUrl, login } from "../../lib/tfd-api";
import { LoginView } from "./login-view";

export function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login(username, password);
      saveAccessToken(response.accessToken);
      setPassword("");
      router.replace("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel entrar no sistema.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LoginView
      apiUrl={apiUrl}
      error={error}
      isSubmitting={isSubmitting}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onUsernameChange={setUsername}
      password={password}
      username={username}
    />
  );
}
