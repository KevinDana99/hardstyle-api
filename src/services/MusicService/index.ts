import ScrapingService from "../ScrapingService";

const search = async (query: string) => {
  const results = await ScrapingService.search(query);
  return results;
};
const download = async (artist: string, title: string) => {
  const results = await ScrapingService.download(artist, title);
  return results;
};

const MusicService = {
  search,
  download,
};

export default MusicService;
