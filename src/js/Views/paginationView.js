import icons from '../../img/icons.svg';
import View from './view.js';
import { PAGE_RANGE } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  render(page) {
    this._data = page;
    const markup = this._renderMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.pagenumber);
    });
  }

  _renderMarkup() {
    const curPage = this._data.page;
    const pageNum = Math.ceil(this._data.searchResult.length / PAGE_RANGE);
    //if Page 1:
    if (curPage === 1 && pageNum > 1) {
      return `
          <button class="btn--inline pagination__btn--next" data-pagenumber="${
            curPage + 1
          }">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    //if last page:
    if (curPage === pageNum) {
      return `
          <button class="btn--inline pagination__btn--prev" data-pagenumber="${
            curPage - 1
          }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      `;
    }

    //if there is only one page:
    if (pageNum === 1) {
      return '';
    }

    //else:
    if (curPage > 1 && curPage < pageNum) {
      return `
          <button class="btn--inline pagination__btn--prev" data-pagenumber="${
            curPage - 1
          }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button class="btn--inline pagination__btn--next" data-pagenumber="${
            curPage + 1
          }">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
  }
}

export default new PaginationView();
