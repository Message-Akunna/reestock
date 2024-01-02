import express from "express";
import db from "./src/models";

const app = express();
const port = process.env.PORT || 300;

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
