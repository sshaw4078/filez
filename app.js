import express from "express";
import { getFiles, createFile } from "#db/queries/files";
import { getFolders, getFolder } from "#db/queries/folders";

const app = express();
export default app;

// body-parsing middleware
app.use(express.json());

app.get("/files", async (req, res, next) => {
  try {
    res.send(await getFiles());
  } catch (err) {
    next(err);
  }
});

app.get("/folders", async (req, res, next) => {
  try {
    res.send(await getFolders());
  } catch (err) {
    next(err);
  }
});

app.get("/folders/:id", async (req, res, next) => {
  try {
    const folder = await getFolder(req.params.id);
    if (!folder) return res.status(404).send("Folder not found.");
    res.send(folder);
  } catch (err) {
    next(err);
  }
});

app.post("/folders/:id/files", async (req, res, next) => {
  try {
    const folder = await getFolder(req.params.id);
    if (!folder) return res.status(404).send("Folder not found.");

    if (!req.body) return res.status(400).send("Request body is required.");

    const { name, size } = req.body;
    if (!name || size === undefined) {
      return res.status(400).send("Request body requires: name, size");
    }

    const file = await createFile(name, size, folder.id);
    res.status(201).send(file);
  } catch (err) {
    next(err);
  }
});

// error-handling middleware (must come last)
app.use((err, req, res, next) => {
  // Postgres errors: invalid input (e.g. non-numeric id), unique/not-null/foreign-key violations
  if (["22P02", "23505", "23502", "23503"].includes(err.code)) {
    return res.status(400).send(err.message);
  }
  console.error(err);
  res.status(err.status ?? 500).send(err.message ?? "Sorry! Something went wrong.");
});