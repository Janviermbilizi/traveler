var MaxError = 0;

$(document).ready(function () {
  $("#search").on("click", function () {
    event.preventDefault();
    console.log("button was clicked");
    var cityInput = $("#search-input").val();
    console.log(cityInput);
    getWeatherInfo();
    getCityAttractionsPlaces();
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
  function getWeatherInfo() {
    var cityInput = $("#search-input").val();
    var currentDate = moment().format("LL");
    var WEATHER_API_KEY = config.WEATHER_API_KEY;
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityInput +
      "&units=imperial&appid=" +
      WEATHER_API_KEY;
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
  }

  // ATTRACTIONS
  function getCityAttractionsPlaces() {
    event.preventDefault();

    let cityInput = $("#search-input").val();

    let corsURL = "https://cors-anywhere.herokuapp.com/";

    let GOOGLE_PLACE_API_KEY = config.GOOGLE_PLACE_API_KEY;

    let queryURL =
      corsURL +
      "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
      cityInput +
      "+attraction&key=" +
      GOOGLE_PLACE_API_KEY;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      localStorage.setItem("city search", cityInput);
      var citySearchStore = localStorage.getItem("city search");

      //making the photo reference URL
      let photoRef = response.results[0].photos[0].photo_reference;
      let photoRef1 = response.results[1].photos[0].photo_reference;
      let photoRef2 = response.results[2].photos[0].photo_reference;

      let photoURL =
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=310&photoreference=" +
        photoRef +
        "&key=" +
        GOOGLE_PLACE_API_KEY;
      let photoURL2 =
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=310&photoreference=" +
        photoRef1 +
        "&key=" +
        GOOGLE_PLACE_API_KEY;
      let photoURL3 =
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=310&photoreference=" +
        photoRef2 +
        "&key=" +
        GOOGLE_PLACE_API_KEY;

      //posting the images from the photo reference url to the Div's
      let cardImg1 = $("<img>");
      cardImg1.attr("src", photoURL);
      let cardImg2 = $("<img>");
      cardImg2.attr("src", photoURL2);
      let cardImg3 = $("<img>");
      cardImg3.attr("src", photoURL3);
      $("#card-image1").empty().append(cardImg1);
      $("#card-image2").empty().append(cardImg2);
      $("#card-image3").empty().append(cardImg3);

      //making the name reference URL
      let nameRef = response.results[0].name;
      let nameRef1 = response.results[1].name;
      let nameRef2 = response.results[2].name;
      console.log(nameRef);
      //posting the names to the card content
      $("#card-content1").text(nameRef);
      $("#card-content2").text(nameRef1);
      $("#card-content3").text(nameRef2);

      airoportSearch(cityInput);
    });
  }

  //Define airportsearch function that basically fund the nearest airport to the place the user is visiting and dispaly it
  function airoportSearch(cityInput) {
    var settings = {
      async: true,
      crossDomain: true,
      url:
        "https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/by-text?text=" +
        cityInput,
      method: "GET",
      headers: {
        "x-rapidapi-host": "cometari-airportsfinder-v1.p.rapidapi.com",
        "x-rapidapi-key": "6d5cf5c180mshb8b063a3d796c01p16a795jsnc128322bf4f8",
      },
    };

    $.ajax(settings)
      .done(function (response) {
        $("#airoprt").empty();
        var i = 0;
        var airoportCode = response[i].code;
        if (!airoportCode) alert("could not load the airport info");
        var air = airoportURL(airoportCode);
      })
      .fail(function (e) {
        console.log("Error loading airpott info");
        MaxError++;
        $("#airoprt").html("<h6>Loading...</h6>");
        setTimeout(() => {
          if (MaxError < 4) airoportSearch(cityInput);
        }, 5000);
      });
  }

  //Define airportURL function that basically takes the nearest airport found and display the link to it website
  function airoportURL(airoportCode) {
    var settings = {
      async: true,
      crossDomain: true,
      url: "https://airport-info.p.rapidapi.com/airport?iata=" + airoportCode,
      method: "GET",
      headers: {
        "x-rapidapi-host": "airport-info.p.rapidapi.com",
        "x-rapidapi-key": "6d5cf5c180mshb8b063a3d796c01p16a795jsnc128322bf4f8",
      },
    };

    $.ajax(settings).done(function (response) {
      var airportNewName = response.name;
      var airoprtWebsite = response.website;

      var airportList = $("<li>").text(airportNewName);
      var airoprtUrlSpot = $("<a>").addClass("btn");

      airoprtUrlSpot.text("Visit Airport site");
      airoprtUrlSpot.attr("href", airoprtWebsite).attr("target", "_blank");

      airportList.append(airoprtUrlSpot);
      $("#airoprt").append(airportList);
    });
  }
});
