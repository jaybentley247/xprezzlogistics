const crypto = require("node:crypto");
const express = require("express");
const cors = require("cors");
const { issueToken, requireAdmin, safeEqual } = require("./auth");

// Shipment fields an admin may set on create/update. Tracking history
// (trackingEvents) and stops are deliberately excluded: they only change
// through their own endpoints, and history entries are never edited or removed.
const EDITABLE_FIELDS = [
  "status",
  "service",
  "from",
  "to",
  "eta",
  "weight",
  "description",
  "metrics",
  "customer",
  "details",
  "imageData",
];

const STOP_STATUSES = ["upcoming", "arrived", "departed"];

const newId = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const clean = (v) => (typeof v === "string" ? v.trim() : "");

const titleCase = (s) =>
  clean(s)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

function pick(source, keys) {
  const out = {};
  for (const k of keys) if (source[k] !== undefined) out[k] = source[k];
  return out;
}

function generateTrackingNumber(shipments) {
  let tn;
  do {
    tn = "AWB" + crypto.randomInt(100000000, 999999999) + crypto.randomInt(100, 999);
  } while (shipments.some((s) => s.trackingNumber === tn));
  return tn;
}

function createApp({ store, adminUsername, adminPassword, tokenSecret, corsOrigin }) {
  const app = express();
  const db = () => store.data;

  app.use(cors(corsOrigin ? { origin: corsOrigin.split(",").map((o) => o.trim()) } : {}));
  app.use(express.json({ limit: "15mb" })); // shipment photos arrive as data URLs

  const admin = requireAdmin(tokenSecret);

  const findShipment = (id) =>
    db().shipments.find(
      (s) => s.trackingNumber.toUpperCase() === String(id).trim().toUpperCase(),
    );

  // Middleware: load :id into req.shipment or 404.
  const withShipment = (req, res, next) => {
    req.shipment = findShipment(req.params.id);
    if (!req.shipment) return res.status(404).json({ error: "Shipment not found" });
    next();
  };

  // The only way anything is written to a shipment's history: append.
  function logEvent(shipment, event) {
    shipment.trackingEvents.push({
      id: newId(),
      time: now(),
      type: event.type || "update",
      title: event.title,
      location: clean(event.location),
      description: clean(event.description),
      ...(event.status ? { status: event.status } : {}),
      ...(event.stopId ? { stopId: event.stopId } : {}),
    });
    shipment.updatedAt = now();
  }

  function setStatus(shipment, status, description) {
    const next = clean(status).toUpperCase();
    if (!next || next === shipment.status) return;
    shipment.status = next;
    logEvent(shipment, { type: "status", status: next, title: titleCase(next), description });
  }

  function buildShipment(fields, trackingNumber) {
    const shipment = {
      trackingNumber,
      createdAt: now(),
      updatedAt: now(),
      status: "",
      service: "Standard Shipping",
      from: "",
      to: "",
      eta: "TBD",
      weight: "0 kg",
      description: "",
      metrics: {},
      customer: {},
      details: {},
      imageData: "",
      ...pick(fields, EDITABLE_FIELDS.filter((k) => k !== "status")),
      stops: [],
      trackingEvents: [],
    };
    setStatus(shipment, fields.status || "ACCEPTED", "Shipment created");
    return shipment;
  }

  // ---------- Health ----------
  app.get("/api/health", (req, res) => res.json({ ok: true }));

  // ---------- Auth ----------
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body || {};
    if (
      !adminPassword ||
      !safeEqual(clean(username), adminUsername) ||
      !safeEqual(String(password ?? ""), adminPassword)
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ token: issueToken(adminUsername, tokenSecret) });
  });

  // ---------- Public tracking ----------
  app.get("/api/tracking/:id", withShipment, (req, res) => {
    res.json(req.shipment);
  });

  // ---------- Shipments (admin) ----------
  app.get("/api/shipments", admin, (req, res) => {
    res.json(db().shipments);
  });

  // Create a shipment from the admin form.
  app.post("/api/shipments/direct", admin, async (req, res) => {
    const body = req.body || {};
    const requested = clean(body.trackingNumber).toUpperCase();
    if (requested && findShipment(requested)) {
      return res.status(409).json({ error: "Tracking number already exists" });
    }
    const shipment = buildShipment(body, requested || generateTrackingNumber(db().shipments));
    db().shipments.push(shipment);
    await store.persist();
    res.status(201).json({ success: true, trackingNumber: shipment.trackingNumber, shipment });
  });

  // Create a shipment from a customer quote request.
  app.post("/api/shipments", admin, async (req, res) => {
    const { quoteId, eta } = req.body || {};
    const quote = db().quotes.find((q) => q.id === quoteId);
    if (!quote) return res.status(404).json({ error: "Quote not found" });
    if (quote.status !== "pending") {
      return res.status(409).json({ error: "Quote already converted" });
    }

    const shipment = buildShipment(
      {
        service: titleCase(quote.service) || "Standard Shipping",
        from: quote.from.city || quote.from.address,
        to: quote.to.city || quote.to.address,
        eta: clean(eta) || "TBD",
        weight: `${quote.package.weight || 0} kg`,
        description: quote.notes,
        customer: {
          name: quote.from.name,
          phone: quote.from.phone,
          toName: quote.to.name,
          toPhone: quote.to.phone,
          email: quote.to.email,
        },
        details: {
          senderAddress: [quote.from.address, quote.from.city, quote.from.zip].filter(Boolean).join(", "),
          recipientAddress: [quote.to.address, quote.to.city, quote.to.zip].filter(Boolean).join(", "),
        },
      },
      generateTrackingNumber(db().shipments),
    );
    db().shipments.push(shipment);
    quote.status = "converted";
    quote.trackingNumber = shipment.trackingNumber;
    await store.persist();
    res.status(201).json({ success: true, trackingNumber: shipment.trackingNumber, shipment });
  });

  // Edit shipment details. A status change is appended to the history;
  // nothing already in the history is touched.
  app.patch("/api/shipments/:id", admin, withShipment, async (req, res) => {
    const body = req.body || {};
    const { shipment } = req;
    Object.assign(shipment, pick(body, EDITABLE_FIELDS.filter((k) => k !== "status")));
    shipment.updatedAt = now();
    if (body.status) setStatus(shipment, body.status);
    await store.persist();
    res.json({ success: true, shipment });
  });

  app.patch("/api/shipments/:id/status", admin, withShipment, async (req, res) => {
    const status = clean(req.body?.status);
    if (!status) return res.status(400).json({ error: "Status is required" });
    setStatus(req.shipment, status, clean(req.body?.description));
    await store.persist();
    res.json({ success: true, shipment: req.shipment });
  });

  app.delete("/api/shipments/:id", admin, withShipment, async (req, res) => {
    db().shipments = db().shipments.filter((s) => s !== req.shipment);
    await store.persist();
    res.json({ success: true });
  });

  // ---------- Tracking history (append-only) ----------
  app.post("/api/shipments/:id/events", admin, withShipment, async (req, res) => {
    const title = clean(req.body?.title);
    if (!title) return res.status(400).json({ error: "Title is required" });
    logEvent(req.shipment, {
      type: "update",
      title,
      location: req.body.location,
      description: req.body.description,
    });
    await store.persist();
    res.status(201).json({ success: true, shipment: req.shipment });
  });

  // ---------- Stops along the route (editable) ----------
  const withStop = (req, res, next) => {
    req.stop = req.shipment.stops.find((s) => s.id === req.params.stopId);
    if (!req.stop) return res.status(404).json({ error: "Stop not found" });
    next();
  };

  app.post("/api/shipments/:id/stops", admin, withShipment, async (req, res) => {
    const location = clean(req.body?.location);
    if (!location) return res.status(400).json({ error: "Location is required" });
    const stop = {
      id: newId(),
      location,
      note: clean(req.body.note),
      eta: clean(req.body.eta),
      status: "upcoming",
      arrivedAt: null,
      departedAt: null,
    };
    req.shipment.stops.push(stop);
    logEvent(req.shipment, { type: "route", title: "Stop added to route", location, stopId: stop.id });
    await store.persist();
    res.status(201).json({ success: true, shipment: req.shipment });
  });

  app.patch("/api/shipments/:id/stops/:stopId", admin, withShipment, withStop, async (req, res) => {
    const body = req.body || {};
    const { shipment, stop } = req;

    if (body.location !== undefined) {
      const location = clean(body.location);
      if (!location) return res.status(400).json({ error: "Location cannot be empty" });
      if (location !== stop.location) {
        logEvent(shipment, {
          type: "route",
          title: "Stop updated",
          location,
          description: `Previously: ${stop.location}`,
          stopId: stop.id,
        });
        stop.location = location;
      }
    }
    if (body.note !== undefined) stop.note = clean(body.note);
    if (body.eta !== undefined) stop.eta = clean(body.eta);

    if (body.status !== undefined && body.status !== stop.status) {
      if (!STOP_STATUSES.includes(body.status)) {
        return res.status(400).json({ error: "Invalid stop status" });
      }
      const at = now();
      if (body.status === "arrived") {
        stop.arrivedAt = at;
        stop.departedAt = null;
        logEvent(shipment, { type: "stop", title: `Arrived at ${stop.location}`, location: stop.location, description: stop.note, stopId: stop.id });
      } else if (body.status === "departed") {
        stop.arrivedAt = stop.arrivedAt || at;
        stop.departedAt = at;
        logEvent(shipment, { type: "stop", title: `Departed ${stop.location}`, location: stop.location, description: stop.note, stopId: stop.id });
      } else {
        stop.arrivedAt = null;
        stop.departedAt = null;
        logEvent(shipment, { type: "route", title: "Stop reset to upcoming", location: stop.location, stopId: stop.id });
      }
      stop.status = body.status;
    }

    shipment.updatedAt = now();
    await store.persist();
    res.json({ success: true, shipment });
  });

  app.delete("/api/shipments/:id/stops/:stopId", admin, withShipment, withStop, async (req, res) => {
    const { shipment, stop } = req;
    shipment.stops = shipment.stops.filter((s) => s !== stop);
    logEvent(shipment, { type: "route", title: "Stop removed from route", location: stop.location, stopId: stop.id });
    await store.persist();
    res.json({ success: true, shipment });
  });

  // Reorder stops: body { order: [stopId, ...] } containing every stop id.
  app.put("/api/shipments/:id/stops/order", admin, withShipment, async (req, res) => {
    const order = req.body?.order;
    const { shipment } = req;
    const ids = shipment.stops.map((s) => s.id);
    if (
      !Array.isArray(order) ||
      order.length !== ids.length ||
      !ids.every((id) => order.includes(id))
    ) {
      return res.status(400).json({ error: "Order must list every stop id once" });
    }
    shipment.stops = order.map((id) => shipment.stops.find((s) => s.id === id));
    shipment.updatedAt = now();
    await store.persist();
    res.json({ success: true, shipment });
  });

  // ---------- Quotes ----------
  app.post("/api/quotes", async (req, res) => {
    const b = req.body || {};
    if (!clean(b.fromName) || !clean(b.toName)) {
      return res.status(400).json({ error: "Sender and recipient names are required" });
    }
    const quote = {
      id: "QT" + Date.now().toString(36).toUpperCase() + crypto.randomInt(10, 99),
      createdAt: now(),
      status: "pending",
      service: clean(b.service) || "standard",
      notes: clean(b.notes),
      from: {
        name: clean(b.fromName), address: clean(b.fromAddress), city: clean(b.fromCity),
        zip: clean(b.fromZip), phone: clean(b.fromPhone), email: clean(b.fromEmail),
      },
      to: {
        name: clean(b.toName), address: clean(b.toAddress), city: clean(b.toCity),
        zip: clean(b.toZip), phone: clean(b.toPhone), email: clean(b.toEmail),
      },
      package: {
        weight: clean(b.weight), length: clean(b.length),
        width: clean(b.width), height: clean(b.height),
      },
    };
    db().quotes.push(quote);
    await store.persist();
    res.status(201).json({ success: true, id: quote.id });
  });

  app.get("/api/quotes", admin, (req, res) => res.json(db().quotes));

  // ---------- Contact messages ----------
  app.post("/api/contact", async (req, res) => {
    const b = req.body || {};
    if (!clean(b.email) || !clean(b.message)) {
      return res.status(400).json({ error: "Email and message are required" });
    }
    const fields = ["firstName", "lastName", "email", "phone", "topic", "message"];
    db().messages.push({
      id: newId(),
      createdAt: now(),
      ...Object.fromEntries(fields.map((k) => [k, clean(b[k])])),
    });
    await store.persist();
    res.status(201).json({ success: true });
  });

  app.get("/api/contact", admin, (req, res) => res.json(db().messages));

  // ---------- Errors ----------
  app.use((req, res) => res.status(404).json({ error: "Not found" }));
  app.use((err, req, res, next) => {
    if (err.type === "entity.too.large") {
      return res.status(413).json({ error: "Upload too large" });
    }
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Invalid JSON" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  });

  return app;
}

module.exports = { createApp };
