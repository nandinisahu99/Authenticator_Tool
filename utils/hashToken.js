import crypto from "crypto";
export const hashToken = function (token) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
};
