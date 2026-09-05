import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET ?? "default_secret_change_in_production";
const AUTH_EXPIRES_IN = "1d";

// Hash un mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

// Vérifie un mot de passe contre un hash
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Génère un token JWT pour un utilisateur
export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, AUTH_SECRET, { expiresIn: AUTH_EXPIRES_IN });
};

// Vérifie un token JWT et retourne l'ID de l'utilisateur
export const verifyToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, AUTH_SECRET) as { userId: number };
    return decoded;
  } catch {
    return null;
  }
};

// Nettoie les données sensibles d'un utilisateur avant de les retourner
export const sanitizeUser = (user: any) => {
  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
};