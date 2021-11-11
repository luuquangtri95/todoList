function getAllLiElements() {
  return document.querySelectorAll("ul#todo__list > li");
}

function isMatchStatus(liElement, filterStatus) {
  return filterStatus === "all" || liElement.dataset.status === filterStatus;
}

function isMatchSearch(liElement, searchTerm) {
  if (searchTerm === "") return true;

  const titleElement = liElement.querySelector("p.todo__heading");

  return titleElement.textContent
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
}

function isMatch(liElement, params) {
  return (
    isMatchSearch(liElement, params.get("searchTerm")) &&
    isMatchStatus(liElement, params.get("status"))
  );
}

// function searchTodo(searchTerm) {
//   const todoElements = getAllLiElements();
//   if (!todoElements) return;

//   for (const liElement of todoElements) {
//     const needToShow = isMatch(liElement, searchTerm);

//     liElement.hidden = !needToShow;
//   }
// }

// function filterTodo(filterStatus) {
//   const todoElements = getAllLiElements();
//   if (!todoElements) return;

//   for (const liElement of todoElements) {
//     const needToShow =
//       filterStatus === "all" || filterStatus === liElement.dataset.status;

//     liElement.hidden = !needToShow;
//   }
// }

//! handle url search params
function handleFilterChange(filterName, filterValue) {
  //! UPDATE QUERY PARAMS
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);

  history.pushState({}, "", url);

  const todoElements = getAllLiElements();
  if (!todoElements) return;

  for (const liElement of todoElements) {
    const needToShow = isMatch(liElement, url.searchParams);

    liElement.hidden = !needToShow;
  }
}

function initSearchTodo(params) {
  const searchInput = document.getElementById("searchTerm");
  if (!searchInput) return;

  if (params.get("searchTerm")) {
    searchInput.value = params.get("searchTerm");
  }

  searchInput.addEventListener("input", () => {
    // searchTodo(searchInput.value);

    handleFilterChange("searchTerm", searchInput.value);
  });
}

function initFilterStatus(params) {
  const filterStatus = document.getElementById("filterStatus");
  if (!filterStatus) return;

  if (params.get("status")) {
    filterStatus.value = params.get("status");
  }

  filterStatus.addEventListener("change", () => {
    // filterTodo(filterStatus.value);

    handleFilterChange("status", filterStatus.value);
  });
}

(() => {
  //get query params obj
  const params = new URLSearchParams(window.location.search);

  initSearchTodo(params);
  initFilterStatus(params);
})();
