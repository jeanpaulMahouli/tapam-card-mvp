import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash du mot de passe pour l'admin et les utilisateurs
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  // Création d'un admin
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      passwordHash: adminPassword,
      email: "admin@tapam.card",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // Création d'un utilisateur
  const user = await prisma.user.create({
    data: {
      username: "jeanpaul",
      passwordHash: userPassword,
      email: "jeanpaul@test.com",
      phone: "+237698955741",
      role: "USER",
      status: "ACTIVE",
    },
  });

  // Création d'un profil pour l'utilisateur
  await prisma.profile.create({
    data: {
      userId: user.id,
      firstName: "Jean Paul",
      lastName: "Mahouli",
      jobTitle: "Développeur Fullstack",
      company: "Freelance",
      bio: "Développeur passionné par les technologies web et mobiles.",
      phone: "+237698955741",
      whatsapp: "+237698955741",
      email: "jeanpaul@test.com",
      website: "https://jeanpaul.dev",
      linkedin: "https://linkedin.com/in/jeanpaul",
      facebook: "https://facebook.com/jeanpaul",
      instagram: "https://instagram.com/jeanpaul",
      tiktok: "https://tiktok.com/@jeanpaul",
      location: "Douala, Cameroun",
    },
  });

  // Création d'une carte pour l'utilisateur
  await prisma.card.create({
    data: {
      cardNumber: "TPM-000001",
      slug: "tpm-000001",
      type: "EXPRESS",
      status: "ACTIVE",
      publicUrl: "http://localhost:3000/p/tpm-000001",
      userId: user.id,
      activatedAt: new Date(),
    },
  });

  // Création de designs
  await prisma.design.createMany({
    data: [
      {
        name: "Minimaliste",
        slug: "minimaliste",
        previewImage: "/images/designs/minimaliste.png",
        isActive: true,
      },
      {
        name: "Élégant",
        slug: "elegant",
        previewImage: "/images/designs/elegant.png",
        isActive: true,
      },
      {
        name: "Professionnel",
        slug: "professionnel",
        previewImage: "/images/designs/professionnel.png",
        isActive: true,
      },
    ],
  });

  console.log("Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });