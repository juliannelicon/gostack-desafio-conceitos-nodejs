const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = repositories.find(repository => repository.id === id);

  if(repositoryIndex < 0) {
    response.status(400).json({ error: "Repository not found" })
  }

  const repositoryNew = {
    id,
    title,
    url,
    techs,
    likes: repository.likes,
  }

  repositories[repositoryIndex] = repositoryNew;

  return response.json(repositoryNew);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    response.status(400).json({ error: "Repository not found" })
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = repositories.find(repository => repository.id === id);

  if(repositoryIndex < 0) {
    response.status(400).json({ error: "Repository not found" })
  }

  const likes = repository.likes + 1;

  const repositoryNew = {
    id,
    title: repository.title,
    url: repository.url,
    techs: repository.techs,
    likes: likes,
  }

  repositories[repositoryIndex] = repositoryNew;

  return response.json(repositoryNew);
});

module.exports = app;
