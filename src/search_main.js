function getAllTodoElements() {
  return document.querySelectorAll("ul#todo__list > li");
}

function isMatch(liElement, searchTerm) {
  if (searchTerm === "") return true;

  const title = liElement.querySelector("p.todo__heading");

  return title.textContent.toLowerCase().includes(searchTerm.toLowerCase());
}

function searchTodo(searchTerm) {
  const todoElements = getAllTodoElements();

  for (const liElement of todoElements) {
    const needToShow = isMatch(liElement, searchTerm);

    /**
     * $0.hidden = true => hidden element
     * $0.hidden = false => show
     */
    liElement.hidden = !needToShow;
  }
}

function initSearchInput() {
  // get form search
  const searchInput = document.getElementById("searchTerm");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    searchTodo(searchInput.value);
  });
}

(() => {
  initSearchInput();
})();
