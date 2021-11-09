// create li element
function createLiElement(todoItem) {
  if (!todoItem) return null;

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
  titleElement.textContent = todoItem.title;

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

      localStorage.setItem("todo_list", JSON.stringify(todoList));

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

      localStorage.setItem("todo_list", JSON.stringify(newTodoList));

      // remove from UI

      liElement.remove();
    });
  }

  //edit
  const editBtn = liElement.querySelector("button.edit");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      //! khi edit phải đảm bảo dữ liệu là mới nhất => get localstorage
      const todoList = getTodoItemLocalStorage();

      //find todo
      const latestTodo = todoList.find((x) => x.id === todoItem.id);
      if (!latestTodo) return;

      //change text to create => edit,  edit => create
      const label = document.getElementById("id-label");
      label.textContent = "Form edit value";

      populateTodoForm(latestTodo);
    });
  }
  return liElement;
}

function populateTodoForm(todo) {
  //? update data-id for form

  const todoForm = document.getElementById("todoFormId");
  if (!todoForm) return;

  todoForm.dataset.id = todo.id;

  //? update value to input
  const inputValue = document.getElementById("todoItem");
  if (inputValue) inputValue.value = todo.title;
}

//render ul element
function renderUlElement(todoList, ulElementId) {
  if (!Array.isArray(todoList) || todoList.length === 0) return;

  const ulElement = document.getElementById(ulElementId);
  if (!ulElement) return;

  for (let todo of todoList) {
    const liElement = createLiElement(todo);

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

function handleSubmit(e) {
  e.preventDefault();

  //get value input
  const inputValue = document.getElementById("todoItem");

  //determine add or edit mode
  const formSubmit = document.getElementById("todoFormId");
  if (!formSubmit) return;

  const isEdit = Boolean(formSubmit.dataset.id);

  if (isEdit) {
    // !edit mode
    /**
     * find current todo
     * update content
     * save
     * apply UI
     */

    const todoList = getTodoItemLocalStorage();
    const index = todoList.findIndex(
      (x) => x.id.toString() === formSubmit.dataset.id
    );

    if (index < 0) return;

    //update content
    todoList[index].title = inputValue.value;

    //saves
    localStorage.setItem("todo_list", JSON.stringify(todoList));

    //apply UI change
    //find li element having id = todoForm.dataset.id

    const findLiElement = document.querySelector(
      `ul#todo__list > li[data-id="${formSubmit.dataset.id}"]`
    );

    console.log(findLiElement);

    if (findLiElement) {
      const titleElement = findLiElement.querySelector(".todo__heading");
      if (titleElement) titleElement.textContent = inputValue.value;
    }
  } else {
    // add mode

    const messageError = document.getElementById("todoHelp");
    const specialCharacter = "!@#$%^&*()";

    if (!inputValue || inputValue.value === "") {
      //validate form

      messageError.textContent =
        "bạn nhập chưa đúng hoặc value là rỗng !!! vui lòng nhập lại";
      messageError.classList.add("alert-danger");

      return;
    }

    if (inputValue.value.length < 8) {
      messageError.textContent = "Todo phải > 8 ký tự";
      messageError.classList.add("alert-danger");

      return;
    }

    if (
      inputValue.value
        .split("")
        .some((character) => specialCharacter.includes(character))
    ) {
      messageError.textContent =
        "Todo không chứa ký tự đặt biệt : !@#$%^&*() , vui lòng nhập lại";
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

    localStorage.setItem("todo_list", JSON.stringify(todoList));

    //! render new todo

    const ulElement = document.getElementById("todo__list");
    ulElement.appendChild(createLiElement(newTodo));
  }

  // !clear form
  //delete data-id
  delete formSubmit.dataset.id;
  formSubmit.reset();
}

// main
(() => {
  const todoList = getTodoItemLocalStorage();

  renderUlElement(todoList, "todo__list");

  const formSubmit = document.getElementById("todoFormId");
  formSubmit.addEventListener("submit", handleSubmit);
})();
