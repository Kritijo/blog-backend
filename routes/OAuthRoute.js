const { Router } = require("express");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const oAuth = Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth.get("/google", (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["openid", "email", "profile"],
  });

  res.redirect(url);
});

const prisma = require("../config/prisma")

oAuth.get("/google/callback", async (req, res) => {
  try {
    const { tokens } = await client.getToken(req.query.code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name } = ticket.getPayload();

    let user = await prisma.user.findFirst({
      where: {
        accounts: {
          some: { provider: "google", providerAccountId: googleId },
        },
      },
    });

    if (!user) {
      user = await prisma.user.upsert({
        where: { email: email ?? "" },
        update: {},
        create: {
          email,
          name,
          accounts: {
            create: {
              provider: "google",
              providerAccountId: googleId,
            },
          },
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.redirect(process.env.CLIENT_URL);
  } catch (err) {
    if (req.query.error === 'access_denied') {
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=google_failed`);
    }
      console.error("Google OAuth error:", err);
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=google_failed`);
  }
});

module.exports=oAuth;