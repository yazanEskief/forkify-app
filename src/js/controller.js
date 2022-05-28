import * as Model from './Model.js';
import RecipeView from './Views/recipeView.js';
import SearchView from './Views/searchView.js';
import ResultView from './Views/resultView.js';
import PaginationView from './Views/paginationView.js';
import BookmarksView from './Views/bookmarksView.js';
import AddRecipeView from './Views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const getRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    RecipeView.renderSpinner();

    //fetching the recipe:
    await Model.fetchRecipe(id);

    const recipe = Model.state.recipe;

    //rendering the recipe view
    RecipeView.render(recipe);
  } catch (error) {
    console.error(error);
    RecipeView.renderError();
  }
};

const searchRecipe = async function () {
  try {
    // 1. getting the query from the user
    const query = SearchView.getQuery();
    if (!query) return;

    // 2. fetching the query from the API
    await Model.fetchSearch(query);

    // 3. rendering the result
    if (Model.state.search.searchResult.length === 0)
      return ResultView.renderError(
        `we couldn't find this recipe "${query}", please try again!`
      );

    ResultView.render(Model.getPage());
    PaginationView.render(Model.state.search);
  } catch (error) {
    console.error(error);
    ResultView.renderError(error);
  }
};

const handlePagination = function (pageNumber) {
  ResultView.render(Model.getPage(pageNumber));
  PaginationView.render(Model.state.search);
};

const controllServings = function (servingAmount) {
  Model.updateServing(servingAmount);
  //RecipeView.render(Model.state.recipe);
  RecipeView.update(Model.state.recipe);
};

const controllBookmarks = function () {
  if (!Model.state.recipe.bookmarked) {
    Model.addBookmark(Model.state.recipe);
  } else {
    Model.removeBookmark(Model.state.recipe);
  }

  RecipeView.updateBookmark();
  BookmarksView.render(Model.state.bookmarks);
};

const loadBookmarks = function () {
  Model.loadBookmarksFromLocalStoarge();
  BookmarksView.render(Model.state.bookmarks);
};

const uploadRecipe = async function (formData) {
  try {
    AddRecipeView.renderSpinner();

    await Model.uploadRecipe(formData);

    window.history.pushState(null, '', `#${Model.state.recipe.id}`);

    RecipeView.render(Model.state.recipe);

    AddRecipeView.render(Model.state.recipe);

    BookmarksView.render(Model.state.bookmarks);
  } catch (error) {
    AddRecipeView.renderError(error);
  }
};

////////////////////////////////////////
// EVENT listener:
const init = function () {
  RecipeView.addHandlerRender(getRecipe);
  RecipeView.addHandlerTest(controllServings);
  RecipeView.addHandlerBookmarks(controllBookmarks);
  BookmarksView.addHandlerBookmarks(loadBookmarks);
  SearchView.addHandlerSearch(searchRecipe);
  PaginationView.addHandlerPagination(handlePagination);
  AddRecipeView.addHandlerForm(uploadRecipe);
};

init();
