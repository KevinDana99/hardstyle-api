import ScrapingService from "../ScrapingService";
import type { ResultsListType } from "./types";

class MusicService {
  music: string[];
  results: ResultsListType;
  filters: string[];

  constructor() {
    this.music = [];
    this.filters = ["artist", "gender", "sort"];
    this.results = [];
  }
  async search(query: string) {
    const results = await ScrapingService.search(query);
    this.results = results;
    return results;
  }
  async download(artist: string, title: string) {
    const results = await ScrapingService.download(artist, title);
    return results;
  }
}

export default MusicService;
