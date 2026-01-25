import express, { type Request, type Response } from "express";
import { config } from "dotenv";
import MusicService from "./services/MusicService";
import type { DownloadRequestParamsType } from "./services/MusicService/types";
import downloadService from "./services/ScrapingService/download";
config();

const server = express();
const PORT = process.env.PORT || 3001;
server.set("json spaces", 2);

server.get("/api/music/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const musicService = new MusicService();
  const searchResults = await musicService.search(query);
  res.json(searchResults);
});
server.get("/api/music/download", async (req: Request, res: Response) => {
  try {
    const { artist, title, url } = req.query;
    if (!artist || !title) {
      return res.status(400).send("Faltan parámetros artist o title");
    }

    const stream = await downloadService(
      artist as string,
      title as string,
      (url as string) ?? null,
    );

    if (!stream) {
      console.error("❌ No se pudo obtener el stream de downloadService");
      return res.status(404).send("No se pudo obtener el audio");
    }

    res.setHeader("Content-Type", "audio/mpeg"); // Indica que es un archivo MP3
    res.setHeader("Transfer-Encoding", "chunked"); // Avisa que el archivo llegará por partes
    res.setHeader("Connection", "keep-alive"); // Mantiene el túnel abierto mientras fluyen los datos
    res.setHeader("Cache-Control", "no-cache"); // Evita que se guarde un archivo incompleto en caché
    res.setHeader("Access-Control-Allow-Origin", "*");

    const reader = stream.getReader();

    // 3. Bucle de lectura con manejo de errores
    try {
      while (true) {
        const { done, value } = await reader.read();
        console.log({ value, done });
        if (done) break;

        // Verificamos que 'value' contenga datos antes de escribir
        if (value) {
          res.write(Buffer.from(value));
        }
      }
    } catch (streamError) {
      console.error("❌ Error durante la lectura del stream:", streamError);
    } finally {
      res.end(); // Cerramos la conexión siempre
      reader.releaseLock(); // Liberamos el stream
    }
  } catch (globalError) {
    console.error("❌ Error crítico en el endpoint:", globalError);
    if (!res.headersSent) {
      res.status(500).send("Error interno del servidor");
    }
  }
});
server.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});
