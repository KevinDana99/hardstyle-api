import yts, { type OptionsWithSearch } from "yt-search";
import config from "../../../config/index.js";
import type { DonwloadYtRequest } from "./types.js";
import { config as configDotenv } from "dotenv";

export const downloadService = async (artist: string, title: string) => {
  configDotenv();
  try {
    const search = await yts(`${title} ${artist} Hardstyle`);
    const video = search.videos[0];
    if (!video) return null;
    const options: DonwloadYtRequest = {
      method: "GET",
      headers: {
        "x-rapidapi-key": config.API_SECRET_KEY ?? "",
        "x-rapidapi-host": config.API_HOST ?? "",
      },
    };
    console.log({ options, config });
    const response = await fetch(
      `https://${config.API_HOST}/dl?id=${video.videoId}`,
      options,
    );

    const data = (await response.json()) as any;

    console.log(`🎬 Video encontrado: ${video.title}`);
    console.log({ video });

    const audioFormat = data.adaptiveFormats?.find(
      (f: any) => f.itag === 140 || f.itag === 251,
    );
    console.log({ audioFormat });
    if (audioFormat && audioFormat.url) {
      console.log("✅ Link directo de audio extraído con éxito");

      const audioRes = await fetch(audioFormat.url, {
        headers: {
          redirect: "follow",
          "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
          Accept: "*/*",
          "Accept-Encoding": "identity;q=1, *;q=0",
          Referer: "https://www.youtube.com/",
          Origin: "https://www.youtube.com/",
          Connection: "keep-alive",
        },
      });
      const size = audioRes.headers.get("Content-Length");

      return {
        audio_track: audioRes.body,
        meta_data: video,
        size: size,
      };
    } else {
      console.error(
        "❌ No se encontró un formato de audio compatible en la respuesta.",
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Error en el servicio:", error);
    return null;
  }
};
export default downloadService;
