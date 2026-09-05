import { PrismaClient, User } from "@prisma/client";
import { hashPassword, verifyPassword } from "../lib/auth";

const prisma = new PrismaClient();

// Crée un nouvel utilisateur
export const createUser = async (
  username: string,
  email: string,
  phone: string,
  password: string,
  role: "USER" | "ADMIN" = "USER"
): Promise<Omit<User, "passwordHash">> => {
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      phone,
      passwordHash,
      role,
      status: "ACTIVE",
      mustChangePassword: true,
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      mustChangePassword: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

// Met à jour un utilisateur
export const updateUser = async (
  userId: number,
  data: {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    mustChangePassword?: boolean;
  }
): Promise<Omit<User, "passwordHash">> => {
  let passwordHash: string | undefined;

  if (data.password) {
    passwordHash = await hashPassword(data.password);
    delete data.password;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      ...(passwordHash && { passwordHash }),
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      mustChangePassword: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// Récupère un utilisateur par son ID
export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      mustChangePassword: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Récupère un utilisateur par son email
export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      passwordHash: true,
      role: true,
      status: true,
      mustChangePassword: true,
    },
  });
};

// Récupère un utilisateur par son téléphone
export const getUserByPhone = async (phone: string) => {
  return prisma.user.findUnique({
    where: { phone },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      passwordHash: true,
      role: true,
      status: true,
      mustChangePassword: true,
    },
  });
};

// Vérifie les identifiants d'un utilisateur
export const verifyUserCredentials = async (
  identifier: string,
  password: string
): Promise<Omit<User, "passwordHash"> | null> => {
  let user = null;

  if (identifier.includes("@")) {
    user = await getUserByEmail(identifier);
  } else if (/^\+?[0-9\s-]+$/.test(identifier)) {
    user = await getUserByPhone(identifier);
  } else {
    user = await prisma.user.findUnique({
      where: { username: identifier },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        passwordHash: true,
        role: true,
        status: true,
        mustChangePassword: true,
      },
    });
  }

  if (!user) return null;

  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) return null;

  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Désactive un utilisateur
export const deactivateUser = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status: "INACTIVE" },
  });
};

// Active un utilisateur
export const activateUser = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" },
  });
};