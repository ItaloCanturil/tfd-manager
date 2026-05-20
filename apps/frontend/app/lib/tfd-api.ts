export type UserRole = "COORDINATOR" | "RECEPTIONIST" | "TRANSPORT";

export type AuthenticatedUser = {
  id: string;
  name: string;
  role: UserRole;
  username: string;
};

type LoginResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

async function readJson<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const errorBody =
      body && typeof body === "object" ? (body as { message?: unknown }) : null;
    const message =
      typeof errorBody?.message === "string"
        ? errorBody.message
        : "Nao foi possivel concluir a requisicao.";

    throw new Error(message);
  }

  return body as T;
}

export async function login(username: string, password: string) {
  const response = await fetch(`${apiUrl}/auth/login`, {
    body: JSON.stringify({ password, username }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return readJson<LoginResponse>(response);
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${apiUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readJson<AuthenticatedUser>(response);
}

export { apiUrl };
