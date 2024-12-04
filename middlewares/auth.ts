import connectMongo from "@/config/mongo";
import SessionSchema from "@/models/sessions/model";
import jwt from "jsonwebtoken";

export const authMiddleware = async (sessionId: string) => {
  await connectMongo();

  let sub;
  let session;
  try {
    session = await SessionSchema.findById(sessionId);
  } catch (error) {
    console.log("error: ", error);
    return false;
  }
  try {
    if (!session?.session?.token) return false;
    let decoded = jwt.verify(session.token, process.env.TOKEN_PASSWORD ?? "");
    sub = decoded.sub;
  } catch (error) {
    if (!session.session.refreshToken) return false;
    try {
      let decoded = jwt.verify(
        session.session.refreshToken,
        process.env.REFRESH_TOKEN_PASSWORD ?? ""
      );
      sub = decoded.sub;
      return sub;
    } catch (error) {
      return false;
    }
  }
};
