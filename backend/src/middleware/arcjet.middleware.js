import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "SPOOFED_BOT",
        message: "Access denied: spoofed bot detected.",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

export default arcjetProtection;
