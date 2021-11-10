/**
 * get value search input
 * get all elements in ul
 * check textContent title equal value search input
 * if includes in search input,  hidden rest liElement
 * if search value === "" return all liElement
 */

function getAllLiElements() {
  return document.querySelectorAll("ul#todo__list > li");
}

function isMatch(liElement, searchTerm) {
  if (searchTerm === "") return true;

  const headingTodo = liElement.querySelector("p.todo__heading");

  return headingTodo.textContent
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
}

function handleSearchChange(filterName, filterValue) {
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);

  history.pushState({}, "", url);
}

function searchTodoElement(searchTerm) {
  const ulTodoElements = getAllLiElements();
  if (!ulTodoElements) return;

  for (const liElement of ulTodoElements) {
    const needToShow = isMatch(liElement, searchTerm);

    /**
     * $0.hidden = true => ẩn
     * $0.hiddent = false => hiện
     */
    liElement.hidden = !needToShow;
  }
}

function initSearchInput() {
  const searchInput = document.getElementById("searchTerm");
  if (!searchInput) return;

  searchInput.addEventListener("keyup", () => {
    // searchTodoElement(searchInput.value);
    handleSearchChange("searchTerm", searchInput.value);
  });
}

(() => {
  initSearchInput();
})();
