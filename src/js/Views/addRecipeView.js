import View from './view';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _recipeWindow = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnUpload = document.querySelector('.upload__btn');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _parentElement = document.querySelector('.upload');

  constructor() {
    super();
    this.controllWindow();
  }

  render(uploadedRecipe) {
    this._data = uploadedRecipe;

    this._clear();

    const markup = this._showSuccessMessage();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _showSuccessMessage() {
    return `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>you have successfully uploaded your recipe 🤞</p>
        </div>
    `;
  }

  addHandlerForm(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const form = Object.fromEntries([...new FormData(this)]);
      handler(form);
    });
  }

  controllWindow() {
    [this._btnClose, this._btnOpen].forEach(btn =>
      btn.addEventListener('click', this.controllForm.bind(this))
    );
  }

  controllForm() {
    this._overlay.classList.toggle('hidden');
    this._recipeWindow.classList.toggle('hidden');
  }
}

export default new AddRecipeView();
