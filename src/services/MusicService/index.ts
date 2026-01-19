import ScrapingService from "../ScrapingService";
import type { ResultsListType } from "../ScrapingService/download";

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
  async download(url: string) {
    const results = await ScrapingService.download(url);
    return results;
  }
  getOne() {}
  filterByArtist() {}
  filterByGender() {}
  filterSort() {}
}

export default MusicService;
