// utils.js
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

// create li element
function createLiElement(todoItem, params) {
  if (!todoItem) return null;
  if (!params) return;
  /**
   * ! get template li
   * clone node li
   * update title where needed
   */

  const templateTodo = document.getElementById("templateLiElement");
  const liElement = templateTodo.content.firstElementChild.cloneNode(true);

  // ? update status and id attr for li
  liElement.dataset.id = todoItem.id;
  liElement.dataset.status = todoItem.status;

  //? update title li element
  const titleElement = liElement.querySelector("p.todo__heading");
  if (!titleElement) return;
  titleElement.textContent = todoItem.title;

  // ! => IMPORTANCE title render then LiElement has attr hidden
  liElement.hidden = !isMatch(liElement, params);
  //! update class alert based on status
  //render todo status

  const divElement = liElement.querySelector("div.todo");
  const alertClass =
    todoItem.status === "completed" ? "alert-success" : "alert-secondary";

  divElement.classList.remove("alert-secondary", "alert-success");
  divElement.classList.add(alertClass);

  /**
   * ! handle buttons: mark as done, remove
   */

  //mark as done
  // !update status text and color button when not click
  const markAsDoneBtn = liElement.querySelector("button.mark-as-done");
  /**
   * todo: initial state for button
   * create class and text for button
   * update class and text for button
   */
  const btnColor = todoItem.status === "completed" ? "btn-dark" : "btn-success";
  const textBtn = todoItem.status === "completed" ? "Reset" : "Finish";

  markAsDoneBtn.classList.remove("btn-success", "btn-dark");
  markAsDoneBtn.classList.add(btnColor);
  markAsDoneBtn.textContent = textBtn;

  if (markAsDoneBtn) {
    markAsDoneBtn.addEventListener("click", () => {
      const currStatus = liElement.dataset.status;
      const newStatus = currStatus === "pending" ? "completed" : "pending";

      /**
       * todo: handle update status localStorage
       * get value
       * findIndex value
       * update field status
       * save local
       */
      const todoList = getTodoItemLocalStorage();
      const index = todoList.findIndex((x) => x.id === todoItem.id);

      todoList[index].status = newStatus;

      setItemLocalStorage(todoList);

      //liElement update newStatus
      liElement.dataset.status = newStatus;

      // update alert color when click button
      const newAlertClass =
        currStatus === "pending" ? "alert-success" : "alert-secondary";

      divElement.classList.remove("alert-secondary", "alert-success");
      divElement.classList.add(newAlertClass);

      //update text and color for button
      const newTextButton = currStatus === "pending" ? "Reset" : "Finish";
      const newColorButton =
        currStatus === "pending" ? "btn-dark" : "btn-success";

      markAsDoneBtn.textContent = newTextButton;
      markAsDoneBtn.classList.remove("btn-success", "btn-dark");
      markAsDoneBtn.classList.add(newColorButton);
    });
  }

  //remove
  const removeBtn = liElement.querySelector("button.remove");
  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      const todoList = getTodoItemLocalStorage();
      const newTodoList = todoList.filter((x) => x.id !== todoItem.id);

      setItemLocalStorage(newTodoList);

      // remove from UI

      liElement.remove();
    });
  }

  //edit
  const editBtn = liElement.querySelector("button.edit");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const todoList = getTodoItemLocalStorage();

      const latestTodo = todoList.find((x) => x.id === todoItem.id);

      // ?update label create new todo => edit mode todo

      populateTodoForm(latestTodo);
    });
  }

  return liElement;
}

//populateTodoForm
function populateTodoForm(todo) {
  const todoForm = document.getElementById("todoFormId");
  if (!todoForm) return;

  // !update data-id v??o todoForm khi edit mode
  todoForm.dataset.id = todo.id;

  const formInput = document.getElementById("todoItem");
  if (!formInput) return;

  // !update todo.title v??o ?? input
  formInput.value = todo.title;
}

//render ul element
function renderUlElement(todoList, ulElementId, params) {
  if (!Array.isArray(todoList) || todoList.length === 0) return;

  const ulElement = document.getElementById(ulElementId);
  if (!ulElement) return;

  for (let todo of todoList) {
    const liElement = createLiElement(todo, params);

    ulElement.appendChild(liElement);
  }
}

// get todoItem to localstorage
function getTodoItemLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem("todo_list")) || [];
  } catch {
    return [];
  }
}

function setItemLocalStorage(data) {
  return localStorage.setItem("todo_list", JSON.stringify(data));
}

function handleSubmit(e) {
  e.preventDefault();
  const inputValue = document.getElementById("todoItem");
  /**
   * Todo: handle form c?? 2 ph???n: 1 add 2 edit
   * !khi edit form s??? c?? id tr??n form =>> edit xong s??? l???p t???c remove id
   * !khi add form s??? kh??ng c?? id
   */

  // ? check form data-id => n???u c?? th?? edit mode, kh??ng c?? th?? add mode
  const formSubmit = document.getElementById("todoFormId");
  const isEdit = Boolean(formSubmit.dataset.id);

  if (isEdit) {
    //edit mode
    const todoList = getTodoItemLocalStorage();
    const index = todoList.findIndex(
      (x) => x.id.toString() === formSubmit.dataset.id
    );

    todoList[index].title = inputValue.value;

    setItemLocalStorage(todoList);

    const liElement = document.querySelector(
      `ul#todo__list > li[data-id="${formSubmit.dataset.id}"]`
    );

    const headingTitle = liElement.querySelector("p.todo__heading");
    headingTitle.textContent = inputValue.value;

    //clear data-id formdata
    delete formSubmit.dataset.id;
  } else {
    //add mode

    const messageError = document.getElementById("todoHelp");
    const specialCharacter = "!@#$%^&*()";

    if (!inputValue || inputValue.value === "") {
      //validate form

      messageError.textContent =
        "b???n nh???p ch??a ????ng ho???c value l?? r???ng !!! vui l??ng nh???p l???i";
      messageError.classList.add("alert-danger");

      return;
    }

    if (inputValue.value.length < 8) {
      messageError.textContent = "Todo ph???i > 8 k?? t???";
      messageError.classList.add("alert-danger");

      return;
    }

    if (
      inputValue.value
        .split("")
        .some((character) => specialCharacter.includes(character))
    ) {
      messageError.textContent =
        "Todo kh??ng ch???a k?? t??? ?????t bi???t : !@#$%^&*() , vui l??ng nh???p l???i";
      messageError.classList.add("alert-danger");

      return;
    }

    const todoList = getTodoItemLocalStorage();

    const newTodo = {
      id: Date.now(),
      title: inputValue.value,
      status: "pending",
    };

    todoList.push(newTodo);

    setItemLocalStorage(todoList);

    //! render new todo

    const ulElement = document.getElementById("todo__list");
    ulElement.appendChild(createLiElement(newTodo));
  }

  //get value input

  // !clear form

  formSubmit.reset();
}

// main
(() => {
  //get query params render
  const params = new URLSearchParams(window.location.search);

  const todoList = getTodoItemLocalStorage();

  renderUlElement(todoList, "todo__list", params);

  const formSubmit = document.getElementById("todoFormId");
  formSubmit.addEventListener("submit", handleSubmit);
})();

/**
 * ! ~ rework edit mode
 * ! ~ 12/11 rework local history get query params
 */
