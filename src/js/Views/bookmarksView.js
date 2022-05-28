import icons from '../../img/icons.svg';
import View from './view';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _data;

  render(bookmarks) {
    if (bookmarks && bookmarks.length > 0) {
      this._data = bookmarks;
      const markup = this._constBookmarksMarkup();
      this.#clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
      this.highlightActiveRecipe();
    } else {
      this.#clear();
      this._parentElement.insertAdjacentHTML(
        'afterbegin',
        this._showEmptyBookmarkListMessage()
      );
    }
  }

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _showEmptyBookmarkListMessage() {
    return `
                  <div class="message">
                    <div>
                      <svg>
                        <use href="${icons}#icon-smile"></use>
                      </svg>
                    </div>
                    <p>
                      ${this._message}
                    </p>
                  </div>
    `;
  }

  #clear() {
    this._parentElement.innerHTML = '';
  }

  _constBookmarksMarkup() {
    return this._data.map(bm => this._createBookmarkItem(bm)).join('');
  }

  _createBookmarkItem(bookmark) {
    return `
                  <li class="preview">
                    <a
                      class="preview__link"
                      href="#${bookmark.id}"
                    >
                      <figure class="preview__fig">
                        <img
                          src="${bookmark.image}"
                          alt="${bookmark.title}"
                        />
                      </figure>
                      <div class="preview__data">
                        <h4 class="preview__title">${bookmark.title}
                        </h4>
                        <p class="preview__publisher">${bookmark.publisher}</p>
                        <div class="preview__user-generated ${
                          bookmark.key ? '' : 'hidden'
                        }">
                          <svg>
                            <use href="${icons}#icon-user"></use>
                          </svg>
                        </div>
                      </div>
                    </a>
                  </li>
    `;
  }
}

export default new BookmarksView();
