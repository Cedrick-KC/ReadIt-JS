import { createHmac } from "crypto";

// Session management
export const createSession = async (userId: string, email: string, role: string) => {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const sessionData = {
    userId,
    email,
    role,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
    hmac: createSessionHmac(userId, expiresAt),
  };

  return sessionData;
};

export const createSessionHmac = (userId: string, expiresAt: Date) => {
  const secret = process.env.SESSION_SECRET || "default-secret-should-change";
  const data = `${userId}:${expiresAt.toISOString()}`;
  return createHmac("sha256", secret).update(data).digest("hex");
};

// Cookie management
export const setCookie = (response: Response, session: {
  userId: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
  hmac: string;
}) => {
  const sessionValue = `${session.userId}.${session.email}.${session.role}.${session.expiresAt}.${session.hmac}`;
  const maxAge = 60 * 60 * 24 * 365; // 1 year

  // @ts-ignore - Response cookie method
  response.cookies.set("readit_session", sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
};

export const getSession = (): {
  userId: string | null;
  email: string | null;
  role: string | null;
  expiresAt: string | null;
} => {
  if (typeof window === "undefined") {
    return { userId: null, email: null, role: null, expiresAt: null };
  }

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("readit_session="));

  if (!cookie) {
    return { userId: null, email: null, role: null, expiresAt: null };
  }

  const sessionValue = cookie.split("=")[1];
  const parts = sessionValue.split(".");

  if (parts.length !== 5) {
    return { userId: null, email: null, role: null, expiresAt: null };
  }

  const [userId, email, role, expiresAt, hmac] = parts;

  // Verify HMAC
  const expectedHmac = createSessionHmac(userId, new Date(expiresAt));
  if (hmac !== expectedHmac) {
    return { userId: null, email: null, role: null, expiresAt: null };
  }

  // Check expiration
  if (new Date(expiresAt) < new Date()) {
    return { userId: null, email: null, role: null, expiresAt: null };
  }

  return { userId, email, role, expiresAt };
};

export const clearCookie = (response: Response) => {
  // @ts-ignore - Response cookie method
  response.cookies.set("readit_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
};