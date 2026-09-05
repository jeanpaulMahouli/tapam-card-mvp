import { PrismaClient, Profile } from "@prisma/client";

const prisma = new PrismaClient();

// Crée un profil pour un utilisateur
export const createProfile = async (
  userId: number,
  data: Omit<Profile, "id" | "createdAt" | "updatedAt">
): Promise<Profile> => {
  return prisma.profile.create({
    data: {
      ...data,
      userId,
    },
  });
};

// Met à jour un profil
export const updateProfile = async (
  userId: number,
  data: Partial<Omit<Profile, "id" | "userId" | "createdAt" | "updatedAt">>
): Promise<Profile> => {
  return prisma.profile.upsert({
    where: { userId },
    update: data,
    create: {
      ...data,
      userId,
    },
  });
};

// Récupère un profil par l'ID de l'utilisateur
export const getProfileByUserId = async (userId: number) => {
  return prisma.profile.findUnique({
    where: { userId },
    include: { services: true },
  });
};

// Ajoute un service à un profil
export const addServiceToProfile = async (
  profileId: number,
  name: string,
  description: string,
  position: number
) => {
  return prisma.service.create({
    data: {
      profileId,
      name,
      description,
      position,
    },
  });
};

// Met à jour un service
export const updateService = async (
  serviceId: number,
  data: { name?: string; description?: string; position?: number }
) => {
  return prisma.service.update({
    where: { id: serviceId },
    data,
  });
};

// Supprime un service
export const deleteService = async (serviceId: number) => {
  return prisma.service.delete({
    where: { id: serviceId },
  });
};

// Récupère les designs disponibles
export const getAvailableDesigns = async () => {
  return prisma.design.findMany({
    where: { isActive: true },
  });
};

// Met à jour le design d'un utilisateur
export const updateUserDesign = async (userId: number, designId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { designId },
  });
};