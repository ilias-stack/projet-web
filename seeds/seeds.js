const faker = require("faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function emptyDB() {
  await prisma.comment.deleteMany();
  await prisma.articleCategorie.deleteMany();
  await prisma.categorie.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database has been cleared!");
}

const NUM_AUTHORS = 10;
const NUM_ARTICLES = 100;
const MIN_ARTICLE_CATEGORIES = 1;
const MAX_ARTICLE_CATEGORIES = 4;
const MAX_COMMENTS_PER_ARTICLE = 20;

async function insertAllData() {
  // Create authors
  for (var i = 0; i < NUM_AUTHORS; i++) {
    try {
      const name = faker.name.findName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      console.log(i, user);
    } catch (error) {
      console.log("ERROR");
    }
  }

  // Create admin
  const admin = await prisma.user.create({
    data: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "ADMIN",
    },
  });

  // Create categories
  const blogTypes = [
    "How-to",
    "Listicles",
    "Opinion",
    "Tutorials",
    "News",
    "Interviews",
    "Case Studies",
    "Reviews",
    "Personal Stories",
    "Infographics",
  ];
  const categories = [];
  for (i = 0; i < blogTypes.length; i++) {
    const name = blogTypes[i];
    categories.push(
      await prisma.categorie.create({
        data: {
          name,
        },
      })
    );
  }

  // Create articles
  const authors = await prisma.user.findMany({ where: { role: "AUTHOR" } });
  for (i = 0; i < NUM_ARTICLES; i++) {
    const title = faker.lorem.sentence();
    const content = faker.lorem.paragraphs();
    const createdAt = faker.date.past();
    const userId = authors[faker.datatype.number(authors.length - 1)].id;

    // Create article categories
    const articleCategories = [];
    const numArticleCategories = faker.datatype.number({
      min: MIN_ARTICLE_CATEGORIES,
      max: MAX_ARTICLE_CATEGORIES,
    });
    for (let j = 0; j < numArticleCategories; j++) {
      const categorie =
        categories[faker.datatype.number(categories.length - 1)];
      articleCategories.push({
        categorieId: categorie.id,
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        createdAt,
        userId,
        ArticleCategorie: {
          create: articleCategories,
        },
      },
    });

    // Create comments for article
    const numComments = faker.datatype.number(MAX_COMMENTS_PER_ARTICLE);
    for (let k = 0; k < numComments; k++) {
      const email = faker.internet.email();
      const content = faker.lorem.sentences();
      await prisma.comment.create({
        data: {
          email,
          content,
          articleId: article.id,
        },
      });
    }
  }

  console.log("All data was inserted!");

  await prisma.$disconnect();
}

emptyDB();

insertAllData();
