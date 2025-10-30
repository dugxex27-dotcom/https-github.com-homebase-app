import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import { storage } from "./storage";

export async function setupGoogleAuth(app: Express) {
  // Only set up Google OAuth if credentials are provided
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth credentials not found. Skipping Google authentication setup.");
    return;
  }

  // Get the callback URL based on environment
  const getCallbackURL = () => {
    // Use hardcoded production domain for gotohomebase
    const productionDomain = 'gotohomebase.replit.app';
    const callbackUrl = `https://${productionDomain}/auth/google/callback`;
    return callbackUrl;
  };

  // Configure Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: getCallbackURL(),
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const email = profile.emails?.[0]?.value;
          const firstName = profile.name?.givenName || '';
          const lastName = profile.name?.familyName || '';
          const profileImageUrl = profile.photos?.[0]?.value || null;

          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          // Check if user already exists
          let user = await storage.getUserByEmail(email);

          if (user) {
            // Update existing user with latest Google profile info
            user = await storage.upsertUser({
              ...user,
              firstName: firstName || user.firstName,
              lastName: lastName || user.lastName,
              profileImageUrl: profileImageUrl || user.profileImageUrl,
            });
          } else {
            const newUserData = {
              id: `google_${profile.id}`,
              email,
              firstName,
              lastName,
              profileImageUrl,
              role: 'homeowner' as const,
              zipCode: null,
            };
            
            user = await storage.upsertUser(newUserData);
          }

          return done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth routes
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin' }),
    async (req: any, res) => {
      try {
        console.log('[Google OAuth] Callback triggered');
        const user = req.user;

        if (!user) {
          console.log('[Google OAuth] No user found in req.user');
          return res.redirect('/signin');
        }

        console.log('[Google OAuth] User authenticated:', { id: user.id, email: user.email, role: user.role, zipCode: user.zipCode });

        // Create session in the same format as email/password login
        req.session.isAuthenticated = true;
        req.session.user = user;

        console.log('[Google OAuth] Session data set, saving session...');

        // Save session before redirecting
        req.session.save((saveErr: any) => {
          if (saveErr) {
            console.error('[Google OAuth] Session save error:', saveErr);
            return res.redirect('/signin');
          }

          console.log('[Google OAuth] Session saved successfully');

          // Check if user needs to complete profile (add zip code or role)
          if (!user.zipCode) {
            console.log('[Google OAuth] Redirecting to complete-profile (missing zipCode)');
            return res.redirect('/complete-profile');
          }

          // Redirect to appropriate dashboard based on role
          const redirectPath =
            user.role === 'contractor'
              ? '/contractor-dashboard'
              : '/';
          console.log('[Google OAuth] Redirecting to:', redirectPath);
          res.redirect(redirectPath);
        });
      } catch (error) {
        console.error('[Google OAuth] Callback error:', error);
        res.redirect('/signin');
      }
    }
  );

  console.log('Google OAuth authentication configured');
}
