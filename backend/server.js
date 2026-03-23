const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const PORT = Number(process.env.PORT || 5001);
const HAS_JWT_SECRET = Boolean(process.env.JWT_SECRET);
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MONGODB_URI = process.env.MONGODB_URI || "";
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "app-data.json");
const FRONTEND_DIST_DIR = path.resolve(__dirname, "../frontend/dist");

if (process.env.NODE_ENV === "production" && !HAS_JWT_SECRET) {
  console.error("JWT_SECRET must be set in production.");
  process.exit(1);
}

const demoUsers = [
  {
    id: "demo-jane",
    username: "Jane Doe",
    email: "jane@hive.demo",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Community builder and event organizer.",
  },
  {
    id: "demo-john",
    username: "John Smith",
    email: "john@hive.demo",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Product designer and runner.",
  },
];

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    createdAt: { type: String, required: true },
  },
  { versionKey: false }
);

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    from: { type: String, required: true, index: true },
    to: { type: String, required: true, index: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true, index: true },
  },
  { versionKey: false }
);

const UserModel = mongoose.models.HiveUser || mongoose.model("HiveUser", userSchema);
const MessageModel = mongoose.models.HiveMessage || mongoose.model("HiveMessage", messageSchema);

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl || "",
    bio: user.bio || "",
    createdAt: user.createdAt,
  };
}

function sanitizeMessage(message) {
  return {
    id: message.id,
    from: message.from,
    to: message.to,
    content: message.content,
    timestamp: message.timestamp,
  };
}

function getTokenForUser(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function buildDefaultData() {
  const now = new Date().toISOString();

  return {
    users: demoUsers.map((user) => ({
      ...user,
      passwordHash: bcrypt.hashSync("Password123!", 10),
      createdAt: now,
    })),
    messages: [
      {
        id: crypto.randomUUID(),
        from: "demo-jane",
        to: "demo-john",
        content: "See you soon!",
        timestamp: now,
      },
      {
        id: crypto.randomUUID(),
        from: "demo-john",
        to: "demo-jane",
        content: "Tomorrow works for me.",
        timestamp: now,
      },
    ],
  };
}

async function ensureDataFile() {
  await fsp.mkdir(DATA_DIR, { recursive: true });

  if (!fs.existsSync(DATA_FILE)) {
    await fsp.writeFile(DATA_FILE, JSON.stringify(buildDefaultData(), null, 2));
  }
}

async function readData() {
  await ensureDataFile();
  const raw = await fsp.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

let writeQueue = Promise.resolve();

function writeData(updater) {
  writeQueue = writeQueue.then(async () => {
    const data = await readData();
    const nextData = await updater(data);
    await fsp.writeFile(DATA_FILE, JSON.stringify(nextData, null, 2));
    return nextData;
  });

  return writeQueue;
}

async function createFileStorage() {
  await ensureDataFile();

  return {
    mode: "file",
    async getUserByEmail(email) {
      const data = await readData();
      return data.users.find((candidate) => candidate.email === email) || null;
    },
    async getUserById(id) {
      const data = await readData();
      return data.users.find((candidate) => candidate.id === id) || null;
    },
    async createUser({ username, email, passwordHash }) {
      let createdUser = null;

      await writeData(async (data) => {
        const existingUser = data.users.find((candidate) => candidate.email === email);

        if (existingUser) {
          throw createHttpError(409, "Email already registered.");
        }

        createdUser = {
          id: crypto.randomUUID(),
          username,
          email,
          passwordHash,
          avatarUrl: "",
          bio: "",
          createdAt: new Date().toISOString(),
        };

        data.users.push(createdUser);
        return data;
      });

      return createdUser;
    },
    async updateUser(id, updates) {
      let updatedUser = null;

      await writeData(async (data) => {
        const user = data.users.find((candidate) => candidate.id === id);

        if (!user) {
          throw createHttpError(404, "Profile not found.");
        }

        user.username = updates.username;
        user.bio = updates.bio;
        user.avatarUrl = updates.avatarUrl;
        updatedUser = { ...user };

        return data;
      });

      return updatedUser;
    },
    async listContacts(currentUserId) {
      const data = await readData();
      return data.users.filter((user) => user.id !== currentUserId);
    },
    async getConversation(currentUserId, otherUserId) {
      const data = await readData();
      return data.messages
        .filter(
          (message) =>
            (message.from === currentUserId && message.to === otherUserId) ||
            (message.from === otherUserId && message.to === currentUserId)
        )
        .sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp));
    },
    async createMessage({ from, to, content }) {
      let createdMessage = null;

      await writeData(async (data) => {
        const recipient = data.users.find((user) => user.id === to);

        if (!recipient) {
          throw createHttpError(404, "Recipient not found.");
        }

        createdMessage = {
          id: crypto.randomUUID(),
          from,
          to,
          content,
          timestamp: new Date().toISOString(),
        };

        data.messages.push(createdMessage);
        return data;
      });

      return createdMessage;
    },
  };
}

async function seedMongoData() {
  const userCount = await UserModel.countDocuments();

  if (userCount > 0) {
    return;
  }

  const defaultData = buildDefaultData();
  await UserModel.insertMany(defaultData.users);
  await MessageModel.insertMany(defaultData.messages);
}

async function createMongoStorage() {
  await mongoose.connect(MONGODB_URI);
  await seedMongoData();

  return {
    mode: "mongo",
    async getUserByEmail(email) {
      return UserModel.findOne({ email }).lean();
    },
    async getUserById(id) {
      return UserModel.findOne({ id }).lean();
    },
    async createUser({ username, email, passwordHash }) {
      const existingUser = await UserModel.findOne({ email }).lean();

      if (existingUser) {
        throw createHttpError(409, "Email already registered.");
      }

      const createdUser = {
        id: crypto.randomUUID(),
        username,
        email,
        passwordHash,
        avatarUrl: "",
        bio: "",
        createdAt: new Date().toISOString(),
      };

      await UserModel.create(createdUser);
      return createdUser;
    },
    async updateUser(id, updates) {
      const updatedUser = await UserModel.findOneAndUpdate(
        { id },
        {
          $set: {
            username: updates.username,
            bio: updates.bio,
            avatarUrl: updates.avatarUrl,
          },
        },
        { new: true, lean: true }
      );

      if (!updatedUser) {
        throw createHttpError(404, "Profile not found.");
      }

      return updatedUser;
    },
    async listContacts(currentUserId) {
      return UserModel.find({ id: { $ne: currentUserId } }).lean();
    },
    async getConversation(currentUserId, otherUserId) {
      return MessageModel.find({
        $or: [
          { from: currentUserId, to: otherUserId },
          { from: otherUserId, to: currentUserId },
        ],
      })
        .sort({ timestamp: 1 })
        .lean();
    },
    async createMessage({ from, to, content }) {
      const recipient = await UserModel.findOne({ id: to }).lean();

      if (!recipient) {
        throw createHttpError(404, "Recipient not found.");
      }

      const createdMessage = {
        id: crypto.randomUUID(),
        from,
        to,
        content,
        timestamp: new Date().toISOString(),
      };

      await MessageModel.create(createdMessage);
      return createdMessage;
    },
  };
}

async function initializeStorage() {
  if (MONGODB_URI) {
    return createMongoStorage();
  }

  return createFileStorage();
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    const token = authHeader.slice("Bearer ".length);
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (_error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
  },
});

const onlineUsers = new Map();
let storage;

app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  const mongoHealthy = storage?.mode !== "mongo" || mongoose.connection.readyState === 1;
  const fileHealthy = storage?.mode !== "file" || fs.existsSync(DATA_FILE);
  const isHealthy = Boolean(storage) && mongoHealthy && fileHealthy;

  res.status(isHealthy ? 200 : 503).json({
    status: "ok",
    ready: isHealthy,
    storage: storage?.mode || "initializing",
    mongoConnected: mongoose.connection.readyState === 1,
    openAIConfigured: Boolean(OPENAI_API_KEY),
    frontendBuilt: fs.existsSync(FRONTEND_DIST_DIR),
  });
});

app.post("/api/register", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  if (!username || !email || !password) {
    res.status(400).json({ error: "Username, email, and password are required." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters long." });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await storage.createUser({ username, email, passwordHash });
    res.status(201).json({ message: "Account created. You can log in now." });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Unable to create account.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const user = await storage.getUserByEmail(email);

  if (!user) {
    res.status(401).json({ error: "No account found for that email." });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    res.status(401).json({ error: "Incorrect password." });
    return;
  }

  res.json({
    token: getTokenForUser(user),
    user: sanitizeUser(user),
  });
});

app.get("/api/profile", authMiddleware, async (req, res) => {
  const user = await storage.getUserById(req.user.sub);

  if (!user) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }

  res.json({ user: sanitizeUser(user) });
});

app.put("/api/profile", authMiddleware, async (req, res) => {
  const username = String(req.body.username || "").trim();
  const bio = String(req.body.bio || "").trim();
  const avatarUrl = String(req.body.avatarUrl || "").trim();

  if (!username) {
    res.status(400).json({ error: "Username is required." });
    return;
  }

  try {
    const user = await storage.updateUser(req.user.sub, {
      username,
      bio,
      avatarUrl,
    });

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Unable to update profile.",
    });
  }
});

app.get("/api/contacts", authMiddleware, async (req, res) => {
  const contacts = await storage.listContacts(req.user.sub);

  res.json({
    contacts: contacts.map((user) => ({
      ...sanitizeUser(user),
      online: onlineUsers.has(user.id),
    })),
  });
});

app.get("/api/messages/:otherUserId", authMiddleware, async (req, res) => {
  const otherUserId = String(req.params.otherUserId || "");
  const messages = await storage.getConversation(req.user.sub, otherUserId);
  res.json({ messages: messages.map(sanitizeMessage) });
});

app.post("/api/messages", authMiddleware, async (req, res) => {
  const from = req.user.sub;
  const to = String(req.body.to || "").trim();
  const content = String(req.body.content || "").trim();

  if (!to || !content) {
    res.status(400).json({ error: "Recipient and content are required." });
    return;
  }

  try {
    const message = await storage.createMessage({ from, to, content });
    io.to(to).emit("message:new", sanitizeMessage(message));
    res.status(201).json({ message: sanitizeMessage(message) });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message || "Unable to send message.",
    });
  }
});

app.post("/api/chat", async (req, res) => {
  const messages = Array.isArray(req.body.messages) ? req.body.messages : [];

  if (!OPENAI_API_KEY) {
    res.status(503).json({
      error: "Copilot is not configured yet. Add OPENAI_API_KEY on the server to enable it.",
    });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_tokens: 300,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      res.status(response.status).json({
        error: payload.error?.message || "Copilot request failed.",
      });
      return;
    }

    res.json(payload);
  } catch (error) {
    res.status(500).json({
      error: "Copilot request failed.",
      details: error.message,
    });
  }
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    if (typeof userId === "string" && userId) {
      socket.join(userId);
      socket.emit("your-id", userId);
      return;
    }

    socket.emit("your-id", socket.id);
  });

  socket.on("user-online", (userId) => {
    if (typeof userId !== "string" || !userId) {
      return;
    }

    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});

if (fs.existsSync(FRONTEND_DIST_DIR)) {
  app.use(express.static(FRONTEND_DIST_DIR));

  app.get(/^\/(?!api|socket\.io).*/, (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST_DIR, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    error: error.message || "Unexpected server error.",
  });
});

initializeStorage()
  .then((readyStorage) => {
    storage = readyStorage;
    server.listen(PORT, () => {
      console.log(`Hive server listening on port ${PORT} using ${storage.mode} storage`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize storage:", error);
    process.exit(1);
  });
