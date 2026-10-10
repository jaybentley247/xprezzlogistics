const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createApp } = require("./app");
const { createStore } = require("./store");

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xprezz-api-"));
const dataFile = path.join(dir, "db.json");
let server;
let base;
let token;

async function api(method, url, body, auth = true) {
  const res = await fetch(base + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

before(async () => {
  const app = createApp({
    store: createStore(dataFile),
    adminUsername: "admin",
    adminPassword: "secret-pass",
    tokenSecret: "test-secret",
  });
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
  token = (await api("POST", "/api/admin/login", { username: "admin", password: "secret-pass" }, false)).body.token;
});

after(() => {
  server.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("login rejects a wrong password and admin routes need a token", async () => {
  const bad = await api("POST", "/api/admin/login", { username: "admin", password: "nope" }, false);
  assert.equal(bad.status, 401);
  const noAuth = await api("GET", "/api/shipments", undefined, false);
  assert.equal(noAuth.status, 401);
  assert.ok(token);
});

test("updates append to tracking history and never erase it", async () => {
  const created = await api("POST", "/api/shipments/direct", {
    trackingNumber: "AWB100",
    from: "Lagos",
    to: "London",
    // Clients cannot inject or replace history.
    trackingEvents: [{ title: "fake" }],
  });
  assert.equal(created.status, 201);
  let s = created.body.shipment;
  assert.equal(s.status, "ACCEPTED");
  assert.deepEqual(s.trackingEvents.map((e) => e.title), ["Accepted"]);

  s = (await api("PATCH", "/api/shipments/AWB100/status", { status: "PROCESSING" })).body.shipment;
  s = (await api("PATCH", "/api/shipments/AWB100", { status: "IN TRANSIT", eta: "2026-11-01", trackingEvents: [] })).body.shipment;
  assert.equal(s.eta, "2026-11-01");

  const stop = (await api("POST", "/api/shipments/AWB100/stops", { location: "Accra Hub" })).body.shipment.stops[0];
  s = (await api("PATCH", `/api/shipments/AWB100/stops/${stop.id}`, { status: "arrived" })).body.shipment;
  s = (await api("PATCH", `/api/shipments/AWB100/stops/${stop.id}`, { status: "departed" })).body.shipment;
  s = (await api("POST", "/api/shipments/AWB100/events", { title: "Cleared customs", location: "Accra" })).body.shipment;
  // Editing and removing the stop must not remove the arrival/departure records.
  s = (await api("PATCH", `/api/shipments/AWB100/stops/${stop.id}`, { location: "Accra Main Hub" })).body.shipment;
  s = (await api("DELETE", `/api/shipments/AWB100/stops/${stop.id}`)).body.shipment;

  assert.equal(s.stops.length, 0);
  assert.deepEqual(
    s.trackingEvents.map((e) => e.title),
    [
      "Accepted",
      "Processing",
      "In Transit",
      "Stop added to route",
      "Arrived at Accra Hub",
      "Departed Accra Hub",
      "Cleared customs",
      "Stop updated",
      "Stop removed from route",
    ],
  );

  // Public tracking returns the same full history, and it survives a reload from disk.
  const tracked = await api("GET", "/api/tracking/awb100", undefined, false);
  assert.equal(tracked.body.trackingEvents.length, 9);
  await new Promise((r) => setTimeout(r, 50));
  const reloaded = createStore(dataFile).data.shipments.find((x) => x.trackingNumber === "AWB100");
  assert.equal(reloaded.trackingEvents.length, 9);
});

test("setting the same status again does not add a duplicate entry", async () => {
  await api("POST", "/api/shipments/direct", { trackingNumber: "AWB200" });
  await api("PATCH", "/api/shipments/AWB200/status", { status: "ACCEPTED" });
  const s = (await api("GET", "/api/tracking/AWB200", undefined, false)).body;
  assert.equal(s.trackingEvents.length, 1);
});

test("stops can be reordered and validate input", async () => {
  await api("POST", "/api/shipments/direct", { trackingNumber: "AWB300" });
  await api("POST", "/api/shipments/AWB300/stops", { location: "A" });
  const s = (await api("POST", "/api/shipments/AWB300/stops", { location: "B" })).body.shipment;
  const [a, b] = s.stops.map((x) => x.id);

  const reordered = await api("PUT", "/api/shipments/AWB300/stops/order", { order: [b, a] });
  assert.deepEqual(reordered.body.shipment.stops.map((x) => x.location), ["B", "A"]);

  assert.equal((await api("PUT", "/api/shipments/AWB300/stops/order", { order: [a] })).status, 400);
  assert.equal((await api("POST", "/api/shipments/AWB300/stops", { location: " " })).status, 400);
  assert.equal((await api("PATCH", `/api/shipments/AWB300/stops/${a}`, { status: "lost" })).status, 400);
});

test("quotes convert into shipments once", async () => {
  const q = await api("POST", "/api/quotes", { fromName: "Ann", fromCity: "Lagos", toName: "Bo", toCity: "Paris", weight: "4" }, false);
  assert.equal(q.status, 201);
  const made = await api("POST", "/api/shipments", { quoteId: q.body.id, eta: "2026-12-01" });
  assert.equal(made.status, 201);
  assert.equal(made.body.shipment.from, "Lagos");
  assert.equal(made.body.shipment.weight, "4 kg");
  assert.equal((await api("POST", "/api/shipments", { quoteId: q.body.id })).status, 409);
});
