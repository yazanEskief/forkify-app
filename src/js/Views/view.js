import icons from '../../img/icons.svg';

export default class View {
  _parentElement;
  _data;
  _errorMessage = `we couldn't find the recipe you are searching for. please try again !`;

  _clear = function () {
    this._parentElement.innerHTML = '';
  };

  renderError(message = this._errorMessage) {
    const markup = `
       <div class="error">
          <div>
             <svg>
              <use href="${icons}#icon-alert-triangle"></use>
             </svg>
          </div>
          <p>${message}</p>
        </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  highlightActiveRecipe = function () {
    const preview = document.querySelectorAll('.preview');
    const hash = window.location.hash.slice(1);
    if (!preview) return;
    const links = document.querySelectorAll('.preview__link');
    links.forEach(link => {
      const id = link.href.split('#')[1];
      if (id === hash) link.classList.add('preview__link--active');
      else link.classList.remove('preview__link--active');
    });
  };

  renderSpinner = function () {
    const html = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  };
}
