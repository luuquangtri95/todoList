function getAllLiElements() {
  return document.querySelectorAll("ul#todo__list > li");
}

function isMatch(liElement, searchTerm) {
  if (searchTerm === "") return true;

  const titleElement = liElement.querySelector("p.todo__heading");

  return titleElement.textContent
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
}

function searchTodo(searchTerm) {
  const todoElements = getAllLiElements();
  if (!todoElements) return;

  for (const liElement of todoElements) {
    const needToShow = isMatch(liElement, searchTerm);

    liElement.hidden = !needToShow;
  }
}

function filterTodo(filterStatus) {
  const todoElements = getAllLiElements();
  if (!todoElements) return;

  for (const liElement of todoElements) {
    const needToShow =
      filterStatus === "all" || filterStatus === liElement.dataset.status;

    liElement.hidden = !needToShow;
  }
}

//! handle url search params

function initSearchTodo() {
  const searchInput = document.getElementById("searchTerm");
  if (!searchInput) return;

  searchInput.addEventListener("keyup", () => {
    searchTodo(searchInput.value);
  });
}

function initFilterStatus() {
  const filterStatus = document.getElementById("filterStatus");
  if (!filterStatus) return;

  filterStatus.addEventListener("change", () => {
    filterTodo(filterStatus.value);
  });
}

(() => {
  initSearchTodo();
  initFilterStatus();
})();
