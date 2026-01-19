import downloadService from "./download";
import searchService from "./search";

const ScrapingService = {
  search: searchService,
  download: downloadService,
};
export default ScrapingService;
