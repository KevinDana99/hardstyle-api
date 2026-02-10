import type { Response } from "express";
import type yts from "yt-search";

export type StreamType = {
  audio_track: ReadableStream<any> | null;
  meta_data: yts.VideoSearchResult;
  size: string | null;
};

const setHeaders = (res: Response, stream: StreamType) => {
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200, {
    "Duration-Track": stream.meta_data.duration.seconds,
    "Content-Length": stream.size?.toString(),
  });
};

export default setHeaders;
