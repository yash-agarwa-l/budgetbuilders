import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const sentCodes = [];

vi.mock("../src/services/mail.service.js", () => ({
  sendMail: vi.fn(async () => ({ messageId: "test" })),
  sendOtpMail: vi.fn(async (email, otp) => {
    sentCodes.push({ email, otp });
    return { messageId: "test" };
  }),
}));

const { app } = await import("../src/app.js");
const { default: db } = await import("../src/models/index.js");

async function login(email, role = "customer") {
  await request(app)
    .post("/api/auth/otp/request")
    .send({ email, role })
    .expect(200);

  const { otp } = sentCodes.at(-1);

  const response = await request(app)
    .post("/api/auth/otp/verify")
    .send({ email, otp });

  return response.body.data;
}

beforeEach(() => {
  sentCodes.length = 0;
});

describe("POST /api/auth/otp/request", () => {
  it("issues a code without revealing whether the account exists", async () => {
    const response = await request(app)
      .post("/api/auth/otp/request")
      .send({ email: "new@example.com", role: "customer" })
      .expect(200);

    expect(response.body.message).toMatch(/if that address is valid/i);
    expect(sentCodes).toHaveLength(1);
  });

  it("rejects a malformed email address", async () => {
    const response = await request(app)
      .post("/api/auth/otp/request")
      .send({ email: "not-an-email", role: "customer" })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors[0].field).toBe("email");
  });

  it("stores only a hash of the code", async () => {
    await request(app)
      .post("/api/auth/otp/request")
      .send({ email: "hash@example.com", role: "customer" })
      .expect(200);

    const record = await db.EmailOtp.findOne({
      where: { email: "hash@example.com" },
    });

    expect(record.otp_hash).not.toBe(sentCodes[0].otp);
    expect(record.otp_hash).toMatch(/^\$2[aby]\$/);
  });
});

describe("POST /api/auth/otp/verify", () => {
  it("creates the account on first login and returns tokens", async () => {
    await request(app)
      .post("/api/auth/otp/request")
      .send({ email: "first@example.com", role: "builder" })
      .expect(200);

    const response = await request(app)
      .post("/api/auth/otp/verify")
      .send({ email: "first@example.com", otp: sentCodes[0].otp })
      .expect(201);

    expect(response.body.data.accessToken).toBeTruthy();
    expect(response.body.data.refreshToken).toBeTruthy();
    expect(response.body.data.user.role).toBe("builder");
  });

  it("rejects an incorrect code and counts the attempt", async () => {
    await request(app)
      .post("/api/auth/otp/request")
      .send({ email: "wrong@example.com", role: "customer" })
      .expect(200);

    await request(app)
      .post("/api/auth/otp/verify")
      .send({ email: "wrong@example.com", otp: "000000" })
      .expect(401);

    const record = await db.EmailOtp.findOne({
      where: { email: "wrong@example.com" },
    });
    expect(record.attempts).toBe(1);
  });

  it("refuses to reuse a code that was already consumed", async () => {
    await login("reuse@example.com");

    const response = await request(app)
      .post("/api/auth/otp/verify")
      .send({ email: "reuse@example.com", otp: sentCodes[0].otp })
      .expect(400);

    expect(response.body.message).toMatch(/no active code/i);
  });
});

describe("session lifecycle", () => {
  it("rotates the refresh token and rejects the old one", async () => {
    const session = await login("rotate@example.com");

    const refreshed = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: session.refreshToken })
      .expect(200);

    expect(refreshed.body.data.refreshToken).not.toBe(session.refreshToken);

    await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: session.refreshToken })
      .expect(401);
  });

  it("rejects a request with no token", async () => {
    await request(app).get("/api/auth/me").expect(401);
  });

  it("rejects a token signed with the wrong secret", async () => {
    await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer not.a.real.token")
      .expect(401);
  });

  it("revokes the refresh token on logout", async () => {
    const session = await login("logout@example.com");

    await request(app)
      .post("/api/auth/logout")
      .send({ refreshToken: session.refreshToken })
      .expect(200);

    await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: session.refreshToken })
      .expect(401);
  });
});

export { login, sentCodes };
