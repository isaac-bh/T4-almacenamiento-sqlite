const express = require("express");
const db = require("../utils/db");

router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM tareas", (error, rows) => {
    if (error) {
      console.error("Error on query SELECT ALL", error);
      res.status(400).json({ message: "Can't connect to the SQLite database" });
    } else {
      res.json(rows);
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM tareas WHERE id = ?`, id, (error, rows) => {
    if (error) {
      console.error("Error on query SELECT WHERE", error);
      res
        .status(400)
        .json({ message: "Error occured while trying to fetch task" });
    } else {
      res.json(rows);
    }
  });
});

router.post("/", async (req, res) => {
  const { descripcion } = req.body;

  await db.run(
    `INSERT INTO tareas (descripcion) VALUES (?) RETURNING id`,
    [descripcion],
    function (error) {
      if (error) {
        console.error("Error on query INSERT", error);
        res
          .status(400)
          .json({ message: "Error occured while trying to insert" });
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { completada } = req.body;

  db.run(
    `UPDATE tareas SET completada = ? WHERE id = ?`,
    [completada, id],
    function (error) {
      if (error) {
        console.error("Error on query UPDATE", error);
        res
          .status(400)
          .json({ message: "Error occured while trying to update" });
      } else {
        res.json(this.changes);
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM tareas WHERE id = ?`, id, function (error) {
    if (error) {
      console.error("Error on query DELETE", error);
      res.status(400).json({ message: "Error occured while trying to delete" });
    } else {
      res.json({ message: `Tarea ${id} eliminada` });
    }
  });
});

module.exports = router;
