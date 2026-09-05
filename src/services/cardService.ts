import { PrismaClient, CardType, CardStatus } from "@prisma/client";
import { generateToken } from "../lib/auth";

const prisma = new PrismaClient();

// Génère un numéro de carte unique
const generateCardNumber = async (): Promise<string> => {
  const lastCard = await prisma.card.findFirst({
    orderBy: { id: "desc" },
  });

  const nextId = lastCard ? lastCard.id + 1 : 1;
  return `TPM-${String(nextId).padStart(6, "0")}`;
};

// Génère un slug unique pour la carte
const generateCardSlug = async (cardNumber: string): Promise<string> => {
  return cardNumber.toLowerCase().replace(/[^a-z0-9]/g, "-");
};

// Génère une URL publique pour la carte
const generatePublicUrl = (cardSlug: string, appUrl: string): string => {
  return `${appUrl}/p/${cardSlug}`;
};

// Génère un mot de passe temporaire sécurisé
const generateTempPassword = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Crée une nouvelle carte et retourne les informations générées
export const createCard = async (type: CardType, appUrl: string) => {
  const cardNumber = await generateCardNumber();
  const slug = await generateCardSlug(cardNumber);
  const tempPassword = generateTempPassword();
  const publicUrl = generatePublicUrl(slug, appUrl);

  const card = await prisma.card.create({
    data: {
      cardNumber,
      slug,
      type,
      status: "ACTIVE",
      publicUrl,
    },
  });

  return {
    cardNumber,
    slug,
    tempPassword,
    publicUrl,
    cardId: card.id,
  };
};

// Attribue une carte à un utilisateur
export const assignCardToUser = async (cardId: number, userId: number) => {
  return prisma.card.update({
    where: { id: cardId },
    data: { userId },
  });
};

// Désactive une carte
export const deactivateCard = async (cardId: number) => {
  return prisma.card.update({
    where: { id: cardId },
    data: { status: "INACTIVE" },
  });
};

// Suspend une carte
export const suspendCard = async (cardId: number) => {
  return prisma.card.update({
    where: { id: cardId },
    data: { status: "SUSPENDED" },
  });
};

// Active une carte
export const activateCard = async (cardId: number) => {
  return prisma.card.update({
    where: { id: cardId },
    data: { status: "ACTIVE" },
  });
};

// Récupère une carte par son ID
export const getCardById = async (cardId: number) => {
  return prisma.card.findUnique({
    where: { id: cardId },
    include: { user: true },
  });
};

// Récupère une carte par son slug
export const getCardBySlug = async (slug: string) => {
  return prisma.card.findUnique({
    where: { slug },
    include: { user: { include: { profile: true } } },
  });
};

// Enregistre une vue de carte (pour les statistiques)
export const recordCardView = async (cardId: number, userAgent: string, referrer: string) => {
  return prisma.cardView.create({
    data: { cardId, userAgent, referrer },
  });
};