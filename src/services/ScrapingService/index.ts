import downloadService from "./download/index.js";
import searchService from "./search/index.js";

const ScrapingService = {
  search: searchService,
  download: downloadService,
};
export default ScrapingService;
