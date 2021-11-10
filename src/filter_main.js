function getAllLiElements() {
  return document.querySelectorAll("ul#todo__list > li");
}

// persist filters
function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  //! update query params
  history.pushState({}, "", url);
}

function filterTodo(filterStatus) {
  const todoElementList = getAllLiElements();

  for (const liElement of todoElementList) {
    const needToShow =
      filterStatus === "all" || liElement.dataset.status === filterStatus;

    liElement.hidden = !needToShow;

    handleFilterChange("status", filterStatus);
  }
}

function initFilterStatus() {
  //find select
  const filterStatusSelectValue = document.getElementById("filterStatus");
  if (!filterStatusSelectValue) return;

  //attach event change
  filterStatusSelectValue.addEventListener("change", () => {
    // filterTodo(filterStatusSelectValue.value);

    handleFilterChange("status", filterStatusSelectValue.value);
  });
}

(() => {
  initFilterStatus();
})();
