import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use memory store for development since we don't have PostgreSQL configured
  const memoryStore = MemoryStore(session);
  const sessionStore = new memoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  // Check if user already exists to preserve their role
  const existingUser = await storage.getUser(claims["sub"]);
  const role = existingUser?.role || (global as any).pendingUserRole || 'homeowner';
  
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    role: role,
  });
  
  // Clear the pending role
  delete (global as any).pendingUserRole;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent", 
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successRedirect: "/",
      failureRedirect: "/signin",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/signin");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  // For demo purposes, use session-based authentication instead of OAuth
  if (req.session?.isAuthenticated && req.session?.user) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
};

// Role-based authorization middleware
export const requireRole = (role: 'homeowner' | 'contractor'): RequestHandler => {
  return async (req: any, res, next) => {
    // Check if user is authenticated via session
    if (!req.session?.isAuthenticated || !req.session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.session.user;
    
    if (!user || user.role !== role) {
      return res.status(403).json({ message: "Forbidden - insufficient permissions" });
    }

    next();
  };
};

// Middleware that allows both homeowners and contractors access to maintenance features
export const requirePropertyOwner: RequestHandler = async (req: any, res, next) => {
  // Check if user is authenticated via session
  if (!req.session?.isAuthenticated || !req.session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.session.user;
  
  // Allow both homeowners and contractors to manage their own properties for maintenance
  if (!user || (user.role !== 'homeowner' && user.role !== 'contractor')) {
    return res.status(403).json({ message: "Forbidden - insufficient permissions" });
  }

  next();
};

declare global {
  var pendingUserRole: string | undefined;
}