const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");

//! Login method
router.get("/login", (req, res) => {
  const { email, password } = req.query;
  prisma.user
    .findFirstOrThrow({ where: { email, password } })
    .then((result) => {
      req.session.currentUser = result;
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json(err.message);
    });
});

//! Logout method
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    else res.redirect("/");
  });
});

//! Get the current user Data from its sessioin id
router.get("/session", (req, res) => {
  const userInfo = req.session.currentUser;
  if (userInfo == undefined) res.status(404).end("No Info");
  else res.json(userInfo);
});

router.get(
  "/",
  asyncHandler(async function (req, res) {
    const take = +req.query.take || 100;
    const skip = +req.query.skip || 0;
    const response = await prisma.user.findMany({ take, skip });
    const statusCode = response.length > 0 ? 200 : 404;
    res.status(statusCode).json(response);
  })
);

router.get(
  "/:id",
  asyncHandler(async function (req, res) {
    const response = await prisma.user.findUnique({
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
      const { name, email, password, role } = req.body;
      res.json(
        await prisma.user.create({
          data: {
            name,
            email,
            password,
            role: role || "AUTHOR",
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
      const { id, name, email, password, role } = req.body;
      const response = await prisma.user.update({
        where: { id: +id },
        data: {
          name,
          email,
          password,
          role,
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
      const response = await prisma.user.delete({
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
