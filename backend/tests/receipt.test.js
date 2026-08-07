import { test } from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";

const startServer = () =>
  new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });

const stopServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });

test("GET /api/v1/receipts?demo=true returns receipt payloads", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await fetch(`${baseUrl}/api/v1/receipts?demo=true`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.isDemoData, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);

    const receipt = body.data[0];
    assert.ok(receipt.id);
    assert.ok(Array.isArray(receipt.items));
    assert.equal(typeof receipt.subtotal, "number");
    assert.equal(typeof receipt.total, "number");
    assert.ok(receipt.total >= receipt.subtotal);
  } finally {
    await stopServer(server);
  }
});

test("GET /api/v1/receipts/:id?demo=true returns a single receipt", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await fetch(`${baseUrl}/api/v1/receipts/1045?demo=true`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.id, 1045);
    assert.ok(body.data.items.length > 0);
  } finally {
    await stopServer(server);
  }
});

test("PATCH /api/v1/receipts/:id/print records payment method", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await fetch(`${baseUrl}/api/v1/receipts/1045/print`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method: "CARD" }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.payment_method, "CARD");
    assert.ok(body.data.printed_at);
  } finally {
    await stopServer(server);
  }
});

test("PATCH /api/v1/receipts/:id/print rejects invalid payment methods", async () => {
  const { server, baseUrl } = await startServer();

  try {
    const response = await fetch(`${baseUrl}/api/v1/receipts/1045/print`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method: "CRYPTO" }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
  } finally {
    await stopServer(server);
  }
});
