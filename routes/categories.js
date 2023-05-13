const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");

router.get(
  "/",
  asyncHandler(async function (req, res) {
    const take = +req.query.take || 100;
    const skip = +req.query.skip || 0;
    const response = await prisma.categorie.findMany({ take, skip });
    const statusCode = response.length > 0 ? 200 : 404;
    res.status(statusCode).json(response);
  })
);

router.get(
  "/:id(\\d+)",
  asyncHandler(async function (req, res) {
    const response = await prisma.categorie.findUnique({
      where: { id: +req.params.id },
    });
    const statusCode = response == null || response.length <= 0 ? 404 : 200;
    res.status(statusCode).json(response);
  })
);

router.get(
  "/:id",
  asyncHandler(async function (req, res) {
    const response = await prisma.categorie.findUnique({
      where: { name: req.params.id },
    });
    const statusCode = response == null || response.length <= 0 ? 404 : 200;
    res.status(statusCode).json(response);
  })
);

router.post(
  "/",
  asyncHandler(async function (req, res) {
    try {
      const { name } = req.body;
      res.json(
        await prisma.categorie.create({
          data: {
            name,
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
      const { id, name } = req.body;
      const response = await prisma.categorie.update({
        where: { id: +id },
        data: {
          name,
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
      const response = await prisma.categorie.delete({
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
