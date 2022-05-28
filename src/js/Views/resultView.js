import View from './view.js';
import icons from '../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');

  render = function (data) {
    this._data = data;
    const markup = this.#resultsMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    //HIGHLIGHT te active RECIPES in the resultView and in the BookmarksView
    this.highlightActiveRecipe();
  };

  #resultsMarkup() {
    return this._data.map(recipe => this.#resultMarkup(recipe)).join('');
  }

  #resultMarkup(recipe) {
    return `
         <li class="preview">
            <a class="preview__link" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.title}</p>
                <div class="preview__user-generated ${
                  recipe.key ? '' : 'hidden'
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

export default new ResultView();
