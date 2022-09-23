import axios from 'axios';
const API_KEY = '29850422-ad4dd9a6485518a1ab30cd6c1';
const BASE_URL = `https://pixabay.com/api/`;

export default class NewsApiServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    try {
      const PARAMS = `?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
      const response = await axios.get(`${BASE_URL}${PARAMS}`);

      this.incrementPage();

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get serchQuery() {
    return this.searchQuery;
  }

  set serchQuery(newQuery) {
    this.searchQuery = newQuery;
  }
}
