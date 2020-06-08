var MaxError = 0;

$(document).ready(function () {
  $("#search").on("click", function () {
    event.preventDefault();
    console.log("button was clicked");
    var cityInput = $("#search-input").val();

    console.log(cityInput);
  });

  // TO-DO LIST
  var todos = ["Book a hotel", "Rent a car", "Download a map"];
  renderTodos();

  // CREATE CHECKLIST
  function renderTodos() {
    $("#todo-list").empty();
    for (i = 0; i < todos.length; i++) {
      var lableDiv = $("<div>").addClass("todoBox");
      var spanDelete = $("<span>").text("x").addClass("delete");
      spanDelete.attr("data-id", todos[i]);
      var labelList = $("<label>");
      var lableInput = $("<input>").attr("type", "checkbox");
      lableInput.addClass("strikethrough");
      var lableSpan = $("<span>").text(todos[i]);
      lableDiv.append(labelList, spanDelete);
      labelList.append(lableInput, lableSpan);
      $("#todo-list").append(lableDiv);
    }
  }
  // ADD NEW ELEMENT TO CHECKLIST
  $("#todoform").on("submit", function (event) {
    event.preventDefault();
    var todoInput = $("#todo-text").val().trim();
    if (todoInput === "") {
      return;
    }

    $("#todo-text").val("");
    var lableDiv = $("<div>").addClass("todoBox");
    var spanDelete = $("<span>").text("x").addClass("delete");
    spanDelete.attr("data-id", todoInput);
    var labelList = $("<label>");
    var lableInput = $("<input>").attr("type", "checkbox");
    lableInput.addClass("strikethrough");
    var lableSpan = $("<span>").text(todoInput);
    lableDiv.append(labelList, spanDelete);
    labelList.append(lableInput, lableSpan);
    $("#todo-list").append(lableDiv);
  });

  $("body").on("click", ".delete", function () {
    $(this).parent().hide("slow");
  });
});
