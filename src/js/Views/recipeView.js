import icons from '../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './view.js';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');

  render = function (data) {
    this._data = data;
    const markup = this.#recipeMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    //HIGHLIGHT te active RECIPES in the resultView and in the BookmarksView
    this.highlightActiveRecipe();
  };

  update(data) {
    this._data = data;

    const servingAmount = document.querySelector('.recipe__info-data--people');
    servingAmount.textContent = this._data.servings;

    const recipeQuantity = document.querySelectorAll('.recipe__quantity');
    recipeQuantity.forEach((rec, i) => {
      rec.textContent = this._data.ingredients[i].quantity
        ? new Fraction(this._data.ingredients[i].quantity).toString()
        : '';
    });

    const increaseButton = document.querySelector('.btn--increase-servings');
    const decreaseButton = document.querySelector('.btn--decrease-servings');
    increaseButton.dataset.serving = this._data.servings + 1;
    decreaseButton.dataset.serving = this._data.servings - 1;
  }

  addHandlerBookmarks(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerRender(handler) {
    ['load', 'hashchange'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServing(handler) {
    this._parentElement.addEventListener('click', function (e) {
      btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      const servings = +btn.dataset.serving;
      if (servings > 0) handler(servings);
    });
  }

  addHandlerTest = function (handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      const servings = +btn.dataset.serving;
      if (servings > 0) handler(servings);
    });
  };

  updateBookmark() {
    const btnBookmark = document.querySelector('.btn--bookmark');
    btnBookmark.childNodes.forEach((cn, i) => {
      if (cn.nodeName === 'svg') btnBookmark.removeChild(cn);
    });
    const icon = `
                <svg class="">
                  <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
                </svg>
    `;
    btnBookmark.insertAdjacentHTML('afterbegin', icon);
  }

  #ingredientMarkup = function (ing) {
    return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${
                  ing.quantity ? new Fraction(ing.quantity).toString() : ''
                }</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit}</span>
                  ${ing.description}
                </div>
              </li>
                `;
  };

  #recipeMarkup = function () {
    return `
      <figure class="recipe__fig">
              <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
              <h1 class="recipe__title">
                <span>${this._data.title}</span>
              </h1>
            </figure>
    
            <div class="recipe__details">
              <div class="recipe__info">
                <svg class="recipe__info-icon">
                  <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${
                  this._data.cookingTime
                }</span>
                <span class="recipe__info-text">minutes</span>
              </div>
              <div class="recipe__info">
                <svg class="recipe__info-icon">
                  <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${
                  this._data.servings
                }</span>
                <span class="recipe__info-text">servings</span>
    
                <div class="recipe__info-buttons">
                  <button class="btn--tiny btn--decrease-servings" data-serving="${
                    this._data.servings - 1
                  }">
                    <svg>
                      <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                  </button>
                  <button class="btn--tiny btn--increase-servings" data-serving="${
                    this._data.servings + 1
                  }">
                    <svg>
                      <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                  </button>
                </div>
              </div>
    
              <div class="recipe__user-generated ${
                this._data.key ? '' : 'hidden'
              }">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
              <button class="btn--round btn--bookmark">
                <svg class="">
                  <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
                </svg>
              </button>
            </div>
    
            <div class="recipe__ingredients">
              <h2 class="heading--2">Recipe ingredients</h2>
              <ul class="recipe__ingredient-list">
              ${this._data.ingredients.map(this.#ingredientMarkup).join('')}
              </ul>
            </div>
    
            <div class="recipe__directions">
              <h2 class="heading--2">How to cook it</h2>
              <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${
                  this._data.publisher
                }</span>. Please check out
                directions at their website.
              </p>
              <a
                class="btn--small recipe__btn"
                href="${this._data.source}"
                target="_blank"
              >
                <span>Directions</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
              </a>
            </div>
      `;
  };
}

export default new RecipeView();
