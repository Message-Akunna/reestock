import cors from "cors";
import express, { Request } from "express";
//
import db from "./src/models";
import routes from "./src/routes";
import middleware from "./src/routes/middleware";
import { UserAttributes } from "./src/utils/interface"; // adjust the import path to your UserAttributes module

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
    }
  }
}

const app = express();
const port = process.env.PORT || 3000;

//
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);
app.use("/media", express.static(process.env.STORAGE_PATH as string));
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
