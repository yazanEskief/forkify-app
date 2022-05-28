import 'regenerator-runtime/runtime';
import { API_URL, PAGE_RANGE, API_KEY } from './config';
import { getJSON, sendJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    searchResult: [],
    query: '',
    page: 1,
  },
  bookmarks: [],
};

const formatedownloadedRecipe = function (dataFromAPI) {
  return {
    image: dataFromAPI.image_url,
    source: dataFromAPI.source_url,
    publisher: dataFromAPI.publisher,
    cookingTime: dataFromAPI.cooking_time,
    id: dataFromAPI.id,
    ingredients: dataFromAPI.ingredients,
    title: dataFromAPI.title,
    servings: dataFromAPI.servings,
    ...(dataFromAPI.key && { key: dataFromAPI.key }),
  };
};

const formateRecipetoUpload = function (recipe) {
  return {
    cooking_time: +recipe.cookingTime,
    image_url: recipe.image,
    publisher: recipe.publisher,
    servings: +recipe.servings,
    source_url: recipe.sourceUrl,
    title: recipe.title,
  };
};

export const fetchRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
    const temp = data.data.recipe;
    state.recipe = formatedownloadedRecipe(temp);

    isBookmarked();
  } catch (error) {
    throw error;
  }
};

export const fetchSearch = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.query = query;
    state.search.searchResult = data.data.recipes.map(rec => {
      return {
        publisher: rec.publisher,
        image: rec.image_url,
        title: rec.title,
        id: rec.id,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const uploadRecipe = async function (recipeData) {
  try {
    const dataToUpload = formateRecipetoUpload(recipeData);
    dataToUpload.ingredients = Object.entries(recipeData)
      .filter(ing => ing[0].includes('ingredient') && ing[1].length > 0)
      .map(ing => {
        const ingredient = ing[1].split(',');
        if (ingredient.length !== 3)
          throw new error(
            "wrong formated ingredients please fill the ingredients' fields as specified"
          );
        [quantit, unit, description] = ingredient;
        return {
          quantity: quantit ? +quantit : null,
          unit: unit,
          description: description,
        };
      });

    const response = await sendJSON(API_URL, dataToUpload);

    dataToUpload.id = response.data.recipe.id;
    state.recipe = dataToUpload;
    addBookmark(dataToUpload);
    console.log(response);
    console.log(dataToUpload);
  } catch (error) {
    throw new Error(error);
  }
};

export const getPage = function (page = 1) {
  state.search.page = page;
  const start = (page - 1) * PAGE_RANGE;
  const end = page * PAGE_RANGE;
  return state.search.searchResult.slice(start, end);
};

export const updateServing = function (servingAmount) {
  state.recipe.ingredients.forEach(
    ing =>
      (ing.quantity = (ing.quantity * servingAmount) / state.recipe.servings)
  );
  state.recipe.servings = servingAmount;
};

persistBookmarksInLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const loadBookmarksFromLocalStoarge = function () {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};

export const addBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  if (!state.bookmarks.includes(recipe)) state.bookmarks.push(recipe);

  //save bookmarks in local storage
  persistBookmarksInLocalStorage();
};

export const removeBookmark = function (recipe) {
  recipe.bookmarked = false;

  const recipeIndex = state.bookmarks.findIndex(rec => rec.id === recipe.id);
  state.bookmarks.splice(recipeIndex, 1);

  //save bookmarks in local storage
  persistBookmarksInLocalStorage();
};

isBookmarked = function () {
  if (state.bookmarks.some(rec => rec.id === state.recipe.id))
    state.recipe.bookmarked = state.bookmarks.find(
      rec => state.recipe.id === rec.id
    ).bookmarked;
};

export const clearBookmarks = function () {
  localStorage.clear();
};

//(ing.quantity = (quantity * servingAmount) / state.recipe.servings)
