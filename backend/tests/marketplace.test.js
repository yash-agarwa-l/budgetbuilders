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

async function signIn(email, role) {
  await request(app).post("/api/auth/otp/request").send({ email, role });
  const { otp } = sentCodes.at(-1);
  const response = await request(app)
    .post("/api/auth/otp/verify")
    .send({ email, otp });
  return response.body.data.accessToken;
}

const auth = (token) => ({ Authorization: `Bearer ${token}` });

async function createBuilder(email, overrides = {}) {
  const token = await signIn(email, "builder");
  await request(app)
    .post("/api/builders/me")
    .set(auth(token))
    .send({
      name: "Acme Construction",
      phone_no: "+919812345670",
      address: "12 Residency Road",
      gst_number: "22AAAAA0000A1Z5",
      type: "residential",
      years_of_experience: 8,
      ...overrides,
    })
    .expect(201);
  return token;
}

const sampleOrder = {
  total_offered_price: 500000,
  subOrders: [
    {
      type: "room",
      details: { room_type: "bedroom", area: 180 },
    },
  ],
};

beforeEach(() => {
  sentCodes.length = 0;
});

describe("order ownership", () => {
  it("does not let one customer delete another customer's order", async () => {
    const owner = await signIn("owner@example.com", "customer");
    const attacker = await signIn("attacker@example.com", "customer");

    const created = await request(app)
      .post("/api/orders")
      .set(auth(owner))
      .send(sampleOrder)
      .expect(201);

    const orderId = created.body.data.id;

    await request(app)
      .delete(`/api/orders/${orderId}`)
      .set(auth(attacker))
      .expect(404);

    expect(await db.Order.findByPk(orderId)).not.toBeNull();
  });

  it("does not let one customer read another customer's order", async () => {
    const owner = await signIn("owner2@example.com", "customer");
    const attacker = await signIn("attacker2@example.com", "customer");

    const created = await request(app)
      .post("/api/orders")
      .set(auth(owner))
      .send(sampleOrder)
      .expect(201);

    await request(app)
      .get(`/api/orders/${created.body.data.id}`)
      .set(auth(attacker))
      .expect(404);
  });

  it("lists only the caller's own orders", async () => {
    const first = await signIn("list1@example.com", "customer");
    const second = await signIn("list2@example.com", "customer");

    await request(app)
      .post("/api/orders")
      .set(auth(first))
      .send(sampleOrder)
      .expect(201);

    const response = await request(app)
      .get("/api/orders")
      .set(auth(second))
      .expect(200);

    expect(response.body.data.total).toBe(0);
  });

  it("rejects a builder trying to create an order", async () => {
    const builder = await signIn("builder-order@example.com", "builder");

    await request(app)
      .post("/api/orders")
      .set(auth(builder))
      .send(sampleOrder)
      .expect(403);
  });

  it("rejects sub-order details that do not match the declared type", async () => {
    const customer = await signIn("badpayload@example.com", "customer");

    const response = await request(app)
      .post("/api/orders")
      .set(auth(customer))
      .send({
        total_offered_price: 1000,
        subOrders: [{ type: "house", details: { area: 100 } }],
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe("bidding", () => {
  it("records the bid against the authenticated builder, not the body", async () => {
    const customer = await signIn("cust-bid@example.com", "customer");
    const builderToken = await createBuilder("builder-bid@example.com");

    const order = await request(app)
      .post("/api/orders")
      .set(auth(customer))
      .send(sampleOrder)
      .expect(201);

    await request(app)
      .post("/api/bids")
      .set(auth(builderToken))
      .send({ order_id: order.body.data.id, bid_amount: 450000, builder_id: 999 })
      .expect(201);

    const bid = await db.InterestedBuilder.findOne();
    const builder = await db.Builder.findOne();
    expect(bid.builder_id).toBe(builder.id);
  });

  it("accepting a bid awards the order and rejects the competing bids", async () => {
    const customer = await signIn("cust-award@example.com", "customer");
    const winner = await createBuilder("winner@example.com", {
      phone_no: "+919812345671",
      gst_number: "22BBBBB0000B1Z5",
    });
    const loser = await createBuilder("loser@example.com", {
      phone_no: "+919812345672",
      gst_number: "22CCCCC0000C1Z5",
    });

    const order = await request(app)
      .post("/api/orders")
      .set(auth(customer))
      .send(sampleOrder)
      .expect(201);

    const orderId = order.body.data.id;

    const winningBid = await request(app)
      .post("/api/bids")
      .set(auth(winner))
      .send({ order_id: orderId, bid_amount: 420000 })
      .expect(201);

    await request(app)
      .post("/api/bids")
      .set(auth(loser))
      .send({ order_id: orderId, bid_amount: 480000 })
      .expect(201);

    await request(app)
      .post(`/api/bids/${winningBid.body.data.id}/accept`)
      .set(auth(customer))
      .expect(200);

    const awarded = await db.Order.findByPk(orderId);
    expect(awarded.order_status).toBe("accepted");
    expect(Number(awarded.closed_price)).toBe(420000);

    const statuses = (await db.InterestedBuilder.findAll()).map(
      (bid) => bid.bid_status,
    );
    expect(statuses.sort()).toEqual(["accepted", "rejected"]);
  });

  it("does not let a customer accept a bid on somebody else's order", async () => {
    const owner = await signIn("owner-bid@example.com", "customer");
    const attacker = await signIn("attacker-bid@example.com", "customer");
    const builderToken = await createBuilder("builder-award@example.com");

    const order = await request(app)
      .post("/api/orders")
      .set(auth(owner))
      .send(sampleOrder)
      .expect(201);

    const bid = await request(app)
      .post("/api/bids")
      .set(auth(builderToken))
      .send({ order_id: order.body.data.id, bid_amount: 400000 })
      .expect(201);

    await request(app)
      .post(`/api/bids/${bid.body.data.id}/accept`)
      .set(auth(attacker))
      .expect(404);

    const untouched = await db.Order.findByPk(order.body.data.id);
    expect(untouched.order_status).toBe("pending");
  });

  it("refuses a second bid on an order that was already awarded", async () => {
    const customer = await signIn("cust-closed@example.com", "customer");
    const first = await createBuilder("first-closed@example.com");
    const second = await createBuilder("second-closed@example.com", {
      phone_no: "+919812345673",
      gst_number: "22DDDDD0000D1Z5",
    });

    const order = await request(app)
      .post("/api/orders")
      .set(auth(customer))
      .send(sampleOrder)
      .expect(201);

    const bid = await request(app)
      .post("/api/bids")
      .set(auth(first))
      .send({ order_id: order.body.data.id, bid_amount: 400000 })
      .expect(201);

    await request(app)
      .post(`/api/bids/${bid.body.data.id}/accept`)
      .set(auth(customer))
      .expect(200);

    await request(app)
      .post("/api/bids")
      .set(auth(second))
      .send({ order_id: order.body.data.id, bid_amount: 390000 })
      .expect(409);
  });

  it("revises rather than duplicates a builder's bid on the same order", async () => {
    const customer = await signIn("cust-revise@example.com", "customer");
    const builderToken = await createBuilder("builder-revise@example.com");

    const order = await request(app)
      .post("/api/orders")
      .set(auth(customer))
      .send(sampleOrder)
      .expect(201);

    await request(app)
      .post("/api/bids")
      .set(auth(builderToken))
      .send({ order_id: order.body.data.id, bid_amount: 450000 })
      .expect(201);

    await request(app)
      .post("/api/bids")
      .set(auth(builderToken))
      .send({ order_id: order.body.data.id, bid_amount: 430000 })
      .expect(200);

    const bids = await db.InterestedBuilder.findAll();
    expect(bids).toHaveLength(1);
    expect(Number(bids[0].bid_amount)).toBe(430000);
  });

  it("requires a builder profile before bidding", async () => {
    const customer = await signIn("cust-noprofile@example.com", "customer");
    const builderToken = await signIn("noprofile@example.com", "builder");

    const order = await request(app)
      .post("/api/orders")
      .set(auth(customer))
      .send(sampleOrder)
      .expect(201);

    await request(app)
      .post("/api/bids")
      .set(auth(builderToken))
      .send({ order_id: order.body.data.id, bid_amount: 400000 })
      .expect(403);
  });
});

describe("builder directory", () => {
  it("does not expose GST or phone numbers in the public listing", async () => {
    await createBuilder("directory@example.com");
    const customer = await signIn("browser@example.com", "customer");

    const response = await request(app)
      .get("/api/builders")
      .set(auth(customer))
      .expect(200);

    const [builder] = response.body.data.builders;
    expect(builder.name).toBe("Acme Construction");
    expect(builder.gst_number).toBeUndefined();
    expect(builder.phone_no).toBeUndefined();
  });
});
