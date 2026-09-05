import { PrismaClient, User, Role, Status } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Types pour les données utilisateur
export type UserCreateInput = {
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: Role;
};

export type UserUpdateInput = {
  id: number;
  email?: string;
  phone?: string;
  password?: string;
  mustChangePassword?: boolean;
};

// Création d'un nouvel utilisateur
export const createUser = async (data: UserCreateInput): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      phone: data.phone,
      passwordHash: hashedPassword,
      role: data.role || Role.USER,
      status: Status.ACTIVE,
      mustChangePassword: true,
    },
  });
};

// Récupérer un utilisateur par ID
export const getUserById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
    include: { profile: true, cards: true },
  });
};

// Récupérer un utilisateur par nom d'utilisateur
export const getUserByUsername = async (username: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { username },
    include: { profile: true, cards: true },
  });
};

// Mettre à jour un utilisateur
export const updateUser = async (data: UserUpdateInput): Promise<User> => {
  const updateData: any = { ...data };
  
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
    updateData.mustChangePassword = false;
  }

  return await prisma.user.update({
    where: { id: data.id },
    data: updateData,
  });
};

// Mettre à jour le statut d'un utilisateur
export const updateUserStatus = async (id: number, status: Status): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: { status },
  });
};

// Vérifier si un utilisateur existe
export const userExists = async (username: string, email: string, phone: string): Promise<boolean> => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email },
        { phone },
      ],
    },
  });

  return !!existingUser;
};
