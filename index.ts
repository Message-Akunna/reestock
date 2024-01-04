import cors from "cors";
import express from "express";

//
import db from "./src/models";
import routes from "./src/routes";
import middleware from "./src/routes/middleware";

const app = express();
const port = process.env.PORT || 300;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

//
middleware(app);
routes(app);

(async () => {
  try {
    db.sequelize.sync().then(() => {
      app.listen(port, () => {
        console.log(`App listening on port ${port}`);
      });
    });
  } catch (error) {
    throw error;
  }
})();
