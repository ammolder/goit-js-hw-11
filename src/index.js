import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiServise from './js/news-servise';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getRefs } from './js/getRefs';

const refs = getRefs();
const newsApiServise = new NewsApiServise();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  newsApiServise.searchQuery =
    e.currentTarget.elements.searchQuery.value.trim();

  clearHitsContainer();

  refs.loadMoreBtn.classList.add('is-hidden');

  newsApiServise.resetPage();
  const data = await newsApiServise.fetchImages();
  if (newsApiServise.searchQuery === '') {
    return Notify.failure('Please provide keywords to search for.');
  }
  if (data.hits.length === 0) {
    clearHitsContainer();

    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  addCardImage(data.hits);

  refs.loadMoreBtn.classList.remove('is-hidden');

  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

async function onLoadMore(data) {
  const res = await newsApiServise.fetchImages();
  addCardImage(res.hits);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  if (res.totalHits - 40 * (newsApiServise.page - 1) <= 0) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function addCardImage(cardImage) {
  const addMarketing = cardImage
    .map(
      common => `<div class="photo-card">
  <a href="${common.largeImageURL}"><img src=${common.webformatURL} alt="${common.tags}" loading="lazy"/><a/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${common.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${common.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${common.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${common.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  refs.divEl.insertAdjacentHTML('beforeend', addMarketing);
  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

function clearHitsContainer() {
  refs.divEl.innerHTML = '';
}
