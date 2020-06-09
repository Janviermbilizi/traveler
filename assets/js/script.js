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

  // WEATHER CONTENT
  $("#search").on("click", function (event) {
    event.preventDefault();
    var cityInput = $("#search-input").val();
    var currentDate = moment().format("LL");
    var apiKey = "af82d5a25061873accbbaaf6cb52f8c5";
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityInput +
      "&units=imperial&appid=" +
      apiKey;
    //get API data
    $.ajax({ url: queryURL, type: "GET" }).then(function (response) {
      var icon = $("<img>");
      var iconImg = response.weather[0].icon;
      icon.attr(
        "src",
        "https://openweathermap.org/img/wn/" + iconImg + "@2x.png"
      );
      icon.attr("width", 100);
      $("#icon").html(icon);
      $(".current-city").html(response.name);

      $("#date").text(currentDate);
      $("#temp").text("Tempeture : " + response.main.temp + " °F");
      $("#hum").text("Humidity: " + response.main.humidity + " %");
      $("#windy").text("Wind Speed: " + response.wind.speed + " MPH");
      // Converts the temp to Kelvin with the below formula
      var tempF = (response.main.temp - 273.15) * 1.8 + 32;
      $(".tempF").text("Temperature (Kelvin) " + tempF);
      $("#search-input").val("");
    });
  });
});
