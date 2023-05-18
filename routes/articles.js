const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");

//! Library to handle files
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get(
  "/",
  asyncHandler(async function (req, res) {
    const take = +req.query.take || 100;
    const skip = +req.query.skip || 0;
    const response = await prisma.article.findMany({
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });
    const statusCode = response.length > 0 ? 200 : 404;
    res.status(statusCode).json(response);
  })
);

router.get(
  "/:id(\\d+)",
  asyncHandler(async function (req, res) {
    const response = await prisma.article.findUnique({
      where: { id: +req.params.id },
    });
    const statusCode = response == null || response.length <= 0 ? 404 : 200;
    res.status(statusCode).json(response);
  })
);

//! get categories based on their articles
router.get(
  "/articlecategorie/:id(\\d+)",
  asyncHandler(async function (req, res) {
    const response = await prisma.articleCategorie.findMany({
      where: { articleId: +req.params.id },
    });
    const statusCode = response == null || response.length <= 0 ? 404 : 200;
    res.status(statusCode).json(response);
  })
);

router.post(
  "/",
  asyncHandler(async function (req, res) {
    console.log(req.body);
    try {
      const { title, content, image, userId } = req.body;
      res.json(
        await prisma.article.create({
          data: {
            title,
            content,
            image,
            userId: +userId,
          },
        })
      );
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
);

//! This section is to upload and retreive images to and from the server
router.post(
  "/Image",
  upload.single("image"),
  asyncHandler(async function (req, res) {
    if (req.file) {
      const { buffer, mimetype } = req.file;
      const imageData = buffer;

      const image = await prisma.image.create({
        data: {
          data: imageData,
          type: mimetype,
        },
      });

      res.status(200).json({ id: image.id });
    }
    res.end();
  })
);

router.get(
  "/Image/:id",
  asyncHandler(async function (req, res) {
    const image = await prisma.image.findUnique({
      where: { id: +req.params.id },
    });

    if (!image) {
      return res.status(404).send("Image not found");
    }

    const imageData = Buffer.from(image.data, "base64");
    res.writeHead(200, {
      "Content-Type": image.type,
      "Content-Length": imageData.length,
    });
    res.end(imageData);
  })
);
//! End of section

router.patch(
  "/",
  asyncHandler(async function (req, res) {
    try {
      const { id, title, content } = req.body;
      const response = await prisma.article.update({
        where: { id: +id },
        data: {
          title,
          content,
        },
      });
      const statusCode = response == null || response.length <= 0 ? 404 : 200;
      res.status(statusCode).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
);

router.delete(
  "/:id",
  asyncHandler(async function (req, res) {
    try {
      const response = await prisma.article.delete({
        where: { id: +req.params.id },
      });
      const statusCode = response == null || response.length <= 0 ? 404 : 200;
      res.status(statusCode).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
);

module.exports = router;
