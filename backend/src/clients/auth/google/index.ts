import { OAuth2Client } from "google-auth-library";

// Google client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function
export const verifyGoogle = async (idToken: string) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
