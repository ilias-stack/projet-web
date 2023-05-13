const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");

router.get(
  "/",
  asyncHandler(async function (req, res) {
    const take = +req.query.take || 100;
    const skip = +req.query.skip || 0;
    const response = await prisma.comment.findMany({ take, skip });
    const statusCode = response.length > 0 ? 200 : 404;
    res.status(statusCode).json(response);
  })
);

router.get(
  "/:id",
  asyncHandler(async function (req, res) {
    const response = await prisma.comment.findUnique({
      where: { id: +req.params.id },
    });
    const statusCode = response == null || response.length <= 0 ? 404 : 200;
    res.status(statusCode).json(response);
  })
);

router.post(
  "/",
  asyncHandler(async function (req, res) {
    try {
      const { email, content, articleId } = req.body;
      res.json(
        await prisma.comment.create({
          data: {
            email,
            content,
            Article: {
              connect: { id: +articleId },
            },
          },
        })
      );
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  })
);

router.patch(
  "/",
  asyncHandler(async function (req, res) {
    try {
      const { id, content } = req.body;
      const response = await prisma.comment.update({
        where: { id: +id },
        data: {
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
      const response = await prisma.comment.delete({
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
