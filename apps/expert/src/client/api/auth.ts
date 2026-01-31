// import { RegisterInput } from "@/schemas/authSchemas";

// export async function registerUserApi(values: RegisterInput) {
//   const res = await fetch("/api/auth/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(values),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.error || "Registration failed");
//   }

//   return data;
// }

// src/client/api/auth.ts

import { RegisterInput } from "@/schemas/authSchemas";

type MockUser = {
  id: string;
  name: string;
  email: string;
  provider: "credentials" | "google";
};

const MOCK_DELAY = 800;

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function registerUserApi(
  data: RegisterInput
): Promise<MockUser> {
  await wait(MOCK_DELAY);

  // simulate email already exists
  if (data.email === "exists@example.com") {
    throw new Error("Email already registered");
  }

  const user: MockUser = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    provider: "credentials",
  };

  localStorage.setItem("auth_user", JSON.stringify(user));

  return user;
}

export async function googleRegisterApi(): Promise<MockUser> {
  await wait(MOCK_DELAY);

  const user: MockUser = {
    id: crypto.randomUUID(),
    name: "Google User",
    email: "google.user@gmail.com",
    provider: "google",
  };

  localStorage.setItem("auth_user", JSON.stringify(user));

  return user;
}


// src/client/api/auth.ts

type LoginInput = {
  email: string;
  password: string;
};

export async function loginUserApi(
  data: LoginInput
) {
  await wait(MOCK_DELAY);

  // ❌ invalid credentials simulation
  if (data.email !== "demo@mindnamo.com" || data.password !== "password") {
    throw new Error("Invalid email or password");
  }

  const user = {
    id: crypto.randomUUID(),
    name: "Demo Expert",
    email: data.email,
    provider: "credentials",
    role: "expert",
    accessToken: "mock-access-token",
  };

  localStorage.setItem("auth_user", JSON.stringify(user));
  localStorage.setItem("access_token", user.accessToken);

  return user;
}

export async function googleLoginApi() {
  await wait(MOCK_DELAY);

  const user = {
    id: crypto.randomUUID(),
    name: "Google Expert",
    email: "google.expert@gmail.com",
    provider: "google",
    role: "expert",
    accessToken: "mock-google-token",
  };

  localStorage.setItem("auth_user", JSON.stringify(user));
  localStorage.setItem("access_token", user.accessToken);

  return user;
}

