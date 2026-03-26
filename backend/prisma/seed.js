const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: "cat-drinks" },
      update: {},
      create: {
        id: "cat-drinks",
        name: "Drinks",
        billboardLabel: "Refreshing Drinks",
      },
    }),
    prisma.category.upsert({
      where: { id: "cat-food" },
      update: {},
      create: {
        id: "cat-food",
        name: "Food",
        billboardLabel: "Delicious Food",
      },
    }),
    prisma.category.upsert({
      where: { id: "cat-pastry" },
      update: {},
      create: {
        id: "cat-pastry",
        name: "Pastry",
        billboardLabel: "Fresh Pastries",
      },
    }),
  ]);

  // Seed sizes
  const sizes = await Promise.all([
    prisma.size.upsert({
      where: { id: "sz-small" },
      update: {},
      create: { id: "sz-small", name: "Small", value: "S" },
    }),
    prisma.size.upsert({
      where: { id: "sz-medium" },
      update: {},
      create: { id: "sz-medium", name: "Medium", value: "M" },
    }),
    prisma.size.upsert({
      where: { id: "sz-large" },
      update: {},
      create: { id: "sz-large", name: "Large", value: "L" },
    }),
  ]);

  // Seed kitchens
  const kitchens = await Promise.all([
    prisma.kitchen.upsert({
      where: { id: "kt-local" },
      update: {},
      create: { id: "kt-local", name: "Local", value: "local" },
    }),
    prisma.kitchen.upsert({
      where: { id: "kt-western" },
      update: {},
      create: { id: "kt-western", name: "Western", value: "western" },
    }),
    prisma.kitchen.upsert({
      where: { id: "kt-uncle-brew" },
      update: {},
      create: { id: "kt-uncle-brew", name: "Uncle Brew", value: "uncle-brew" },
    }),
    prisma.kitchen.upsert({
      where: { id: "kt-diomedes" },
      update: {},
      create: { id: "kt-diomedes", name: "Diomedes", value: "diomedes" },
    }),
  ]);

  // Seed cuisines
  const cuisines = await Promise.all([
    prisma.cuisine.upsert({
      where: { id: "cu-filipino" },
      update: {},
      create: { id: "cu-filipino", name: "Filipino", value: "filipino" },
    }),
    prisma.cuisine.upsert({
      where: { id: "cu-american" },
      update: {},
      create: { id: "cu-american", name: "American", value: "american" },
    }),
  ]);

  // Seed products
  const productData = [
    {
      id: "prod-brew-coffee",
      name: "Uncle Brew Signature Coffee",
      price: 130,
      isFeatured: true,
      categoryId: "cat-drinks",
      sizeId: "sz-medium",
      kitchenId: "kt-uncle-brew",
      cuisineId: "cu-filipino",
      image: "/assets/img/Food.png",
    },
    {
      id: "prod-caramel-macchiato",
      name: "Caramel Macchiato",
      price: 155,
      isFeatured: true,
      categoryId: "cat-drinks",
      sizeId: "sz-large",
      kitchenId: "kt-uncle-brew",
      cuisineId: "cu-american",
      image: "/assets/img/Food1.png",
    },
    {
      id: "prod-brew-burger",
      name: "Uncle Brew Burger",
      price: 199,
      isFeatured: true,
      categoryId: "cat-food",
      sizeId: "sz-large",
      kitchenId: "kt-uncle-brew",
      cuisineId: "cu-american",
      image: "/assets/img/Food4.png",
    },
    {
      id: "prod-lechon-sandwich",
      name: "Cebu Lechon Sandwich",
      price: 175,
      isFeatured: true,
      categoryId: "cat-food",
      sizeId: "sz-medium",
      kitchenId: "kt-uncle-brew",
      cuisineId: "cu-filipino",
      image: "/assets/img/Food.png",
    },
    {
      id: "prod-croissant",
      name: "Butter Croissant",
      price: 85,
      isFeatured: true,
      categoryId: "cat-pastry",
      sizeId: "sz-small",
      kitchenId: "kt-diomedes",
      cuisineId: "cu-american",
      image: "/assets/img/Food1.png",
    },
    {
      id: "prod-ensaymada",
      name: "Ensaymada",
      price: 75,
      isFeatured: true,
      categoryId: "cat-pastry",
      sizeId: "sz-small",
      kitchenId: "kt-diomedes",
      cuisineId: "cu-filipino",
      image: "/assets/img/Food4.png",
    },
    {
      id: "prod-matcha-latte",
      name: "Matcha Latte",
      price: 145,
      isFeatured: false,
      categoryId: "cat-drinks",
      sizeId: "sz-medium",
      kitchenId: "kt-uncle-brew",
      cuisineId: "cu-american",
      image: "/assets/img/Food.png",
    },
    {
      id: "prod-club-sandwich",
      name: "Club Sandwich",
      price: 165,
      isFeatured: false,
      categoryId: "cat-food",
      sizeId: "sz-medium",
      kitchenId: "kt-uncle-brew",
      cuisineId: "cu-american",
      image: "/assets/img/Food1.png",
    },
    {
      id: "prod-chocolate-croissant",
      name: "Chocolate Croissant",
      price: 95,
      isFeatured: true,
      categoryId: "cat-pastry",
      sizeId: "sz-small",
      kitchenId: "kt-diomedes",
      cuisineId: "cu-american",
      image: "/assets/img/Food.png",
    },
    {
      id: "prod-sourdough-bread",
      name: "Artisan Sourdough",
      price: 120,
      isFeatured: true,
      categoryId: "cat-pastry",
      sizeId: "sz-large",
      kitchenId: "kt-diomedes",
      cuisineId: "cu-american",
      image: "/assets/img/Food4.png",
    },
  ];

  for (const p of productData) {
    const { image, ...fields } = p;
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        ...fields,
        isArchived: false,
        images: { create: [{ url: `http://localhost:3000${image}` }] },
      },
    });
  }

  console.log("Seeded:", {
    categories: categories.length,
    sizes: sizes.length,
    kitchens: kitchens.length,
    cuisines: cuisines.length,
    products: productData.length,
  });

  // Seed admin user
  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@unclebrew.com" },
    update: { role: "admin", emailVerified: true },
    create: {
      name: "Uncle Brew Admin",
      email: "admin@unclebrew.com",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
    },
  });
  console.log("Admin user:", admin.email, "/ password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
