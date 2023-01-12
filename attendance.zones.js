function initialize() {
  initMap();
  initAutocomplete();
}

//These colors make up the possible colors of the results which do not have a color specified (i.e. elementary schools)
const colorOptions = ["#184366", "#e8b20f", "#0e987d", "#e95b37", "#5ab3c4"];
//API key for Google
// const apiKey = "AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM";
//DOM Elements
const submitButton = document.getElementById("checkLoc");
const domAddressInput = document.getElementById("dom-address-input");
const domX = document.getElementById("dom-x");
const domY = document.getElementById("dom-y");
const domResults = document.getElementById("dom-results");
const originInput = document.getElementById("dom-address");
const autocompleteArea = document.getElementById("autocomplete-area");

// Utility Function to Convert 0-indexed numbers to alphabet. 0=>A , 25=>Z, 26=>AA, 55=>BD
function numToAlpha(x) {
  if (x < 0 || x > 701) {
    console.log("function numToAlpha(x)'s Input is too large. 0-701");
    return "Bad Input";
  }
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let div = 26;
  if (x < div) {
    return alphabet[x];
  } else {
    console.log(Math.floor(x / div), (digit = x % div));
    return `${alphabet[Math.floor(x / div) - 1]}${alphabet[(digit = x % div)]}`.trim();
  }
}

//Autocomplete
let autocomplete;
let selectedPlace = { location: {}, address: "" };
let manualComplete = "";
let selectedAutocompleteItem;

let googleDOMNodes;

// Check if any of them are visible (using ES6 here for conciseness)
let googleDOMNodeIsVisible;

function autoCompleteSelected() {
  googleDOMNodes = document.getElementsByClassName("pac-container");
  console.log("Something was selected");
  manualComplete = `${document.querySelector(".pac-item-selected").childNodes[1].innerText}, ${
    document.querySelector(".pac-item-selected").childNodes[2].innerText
  }`;
  console.log(manualComplete);
}

function autoCompleteDefaultSelect() {
  googleDOMNodeIsVisible = Array.from(googleDOMNodes).some((node) => node.offsetParent !== null);
  googleDOMNodes = document.getElementsByClassName("pac-container");
  manualComplete = `${googleDOMNodes[0].childNodes[0].childNodes[1].innerText}, ${googleDOMNodes[0].childNodes[0].childNodes[2].innerText}`;
  console.log("Nothing was selected");
  // If one is visible - preventDefault
  if (googleDOMNodeIsVisible) {
    console.log("its visible...");
    setTimeout(function () {
      domAddressInput.value = manualComplete;
    }, 1);
    e.preventDefault();
  }
}
function initAutocomplete() {
  domAddressInput.addEventListener("keydown", (e) => {
    selectedAutocompleteItem = document.getElementsByClassName("pac-item-selected");

    // If it's Enter

    if (e.key === "Enter") {
      // Select all Google's dropdown DOM nodes (can be multiple)

      // If Dropdown menu item selected via Keys
      if (document.getElementsByClassName("pac-item-selected").length > 0) {
        autoCompleteSelected();
      }
      // If no dropdown menu item selected with keys
      else {
        autoCompleteDefaultSelect();
      }

      // console.log(e);

      // manualComplete = `${googleDOMNodes[0].childNodes[0].childNodes[1].innerText}, ${googleDOMNodes[0].childNodes[0].childNodes[2].innerText}`;
      // console.log(manualComplete);
      // // If one is visible - preventDefault
      // if (googleDOMNodeIsVisible) {
      //   console.log("its visible...");
      //   setTimeout(function () {
      //     domAddressInput.value = manualComplete;
      //   }, 1);
      //   e.preventDefault();
      // }
    }
  });

  //coppell
  const southwest = { lat: 32.95521153131294, lng: -97.0215929504037 };
  //melissa
  const northeast = { lat: 33.28512731658927, lng: -96.57032498871392 };
  const newBounds = new google.maps.LatLngBounds(southwest, northeast);

  const autocomplete = new google.maps.places.Autocomplete(domAddressInput, {
    bounds: newBounds,
    componentRestrictions: { country: "us" },
    fields: ["address_components", "geometry.location"],
    strictBounds: true,
    types: ["premise", "street_address"],
  });

  // https://stackoverflow.com/questions/28443234/google-places-autocomplete-force-select-first-option-if-its-the-only-option-vi

  autocomplete.addListener("place_changed", async function (e) {
    let place = autocomplete.getPlace();
    // console.log(place);
    console.log("Autocomplete Firing");
    // console.log(place.address_components[0]);
    // console.log(place.geometry.location.lat());
    // console.log(place.geometry.location.lng());
    if (!place.geometry) {
      console.log(place);
    } else {
      buildPlace(place);
      // selectedPlace["location"] = await { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      // console.log(selectedPlace);
    }
  });
}

async function buildPlace(placeInput) {
  console.log("buildPlace is running");
  selectedPlace["location"] = await {
    lat: placeInput.geometry.location.lat(),
    lng: placeInput.geometry.location.lng(),
  };
}

let listOfValidZones = [];
function getGeocoding() {
  console.log("Fetching!");
  listOfValidZones = [];
  // let query = encodeURI(domAddressInput.value);
  // const result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`).then(
  //   (response) => (res = response.json())
  // );

  console.log(selectedPlace.location);

  // if (domAddressInput.value.trim()[0] == result.results[0].address_components[0].long_name[0]) {
  console.log("Its an address");

  let colorIndex = 0; //works with "colorOptions"
  function mapColor(x) {
    if (borders[x].color) {
      return borders[x].color;
    }
    let color = colorOptions[colorIndex];
    colorIndex++;
    return color;
  }

  let insideDistrict;
  let count = 0;

  // if (result.results.length > 0) {
  for (let i = 0; i < borders.length; i++) {
    const localBorders = borders[i].border;
    for (specificBorder of localBorders) {
      // console.log(specificBorder[0]);
      insideDistrict = checkInside(specificBorder[0], [selectedPlace.location.lng, selectedPlace.location.lat]);
      if (insideDistrict) {
        count++;
        let entry = {
          name: borders[i].name,
          grades: borders[i].grades,
          type: borders[i].type,
          address: borders[i].address,
          location: borders[i].location,
          color: colorOptions[i],
          color: mapColor(i),
          border: borders[i].border,
        };
        listOfValidZones.push(entry);
      }
    }
  }
  initMap(selectedPlace.location);
  drawResults(selectedPlace.location, count);
}

function nestedArrayToObjects(x) {
  // console.log("nestedArrayToObjects: ", x);
  newObj = [];
  for (i of x) {
    let temp = { lat: i[1], lng: i[0] };
    newObj.push(temp);
  }
  // console.log(`Processed polygon, ${x.length} edges.`);
  return newObj;
}

//=========================Test Function for checking Coverage on map==============================
function checkCoverage(schoolTypeString) {
  let coverageArr = [];
  for (i of borders) {
    if (i.type == schoolTypeString) {
      coverageArr.push(i.border);
    }
  }
  return coverageArr;
}

//=========================Draw Results==============================
// function clearResults() {}

// drawResults(resultInput : Object | insideDistrictBoolean = : Boolean)
function drawResults(resultInput, insideDistrictCounter) {
  // let result = resultInput;
  console.log(resultInput);
  console.log(insideDistrictCounter);
  domResults.innerHTML = "";
  rawHtml = "";

  if (insideDistrictCounter == -1) {
    rawHtml += `
      <li>
        <div style="display: flex; border-radius: 4px; overflow: hidden; border: #184366 1px solid">
          <div style="background-color: red; width: 10px"></div>
          <div>
            <span style="padding-left: 5px;"> No results found for '${domAddressInput.value}'!</span>
          </div>
        </div>
      </li>
    `;
    domResults.innerHTML = rawHtml;
    return;
  }
  if (insideDistrictCounter == 0) {
    rawHtml += `
      <li>
        <div style="display: flex; border-radius: 4px; overflow: hidden; border: red 1px solid">
        <div style="background-color: red; width: 10px"></div>          <div>
            <span style="padding-left: 5px;">'${domAddressInput.value}' is out of district !</span>
          </div>
        </div>
      </li>
    `;
    domResults.innerHTML = rawHtml;
    return;
  }

  if (insideDistrictCounter > 0) {
    for (const [i, result] of listOfValidZones.entries()) {
      rawHtml += `
        <li>
          <div style="display: flex; border-radius: 4px; overflow: hidden; border: ${result.color} 1px solid">
            <div style="background-color: ${result.color}; width: 10px"></div>
            <div>
              <span style="margin-left: 1rem">${numToAlpha(i)}. </span> ${result.name} | Grades:
              ${result.grades} | ${result.address}
            </div>
          </div>
        </li>
      `;
      console.log(result);
    }
    domResults.innerHTML = rawHtml;
    return;
  }
}

//=========================Drawing on Maps==============================
let map;
function initMap(pos = { lat: 33.12443425433204, lng: -96.79647875401061 }) {
  const markerHome = {
    path: "M32 5a21 21 0 0 0-21 21c0 17 21 33 21 33s21-16 21-33A21 21 0 0 0 32 5zm7 20v10h-5v-5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5h-5V25h-4l11-9 11 9z",
    fillColor: "#ed4733",
    strokeColor: "#c82f25",
    fillOpacity: 1,
    strokeWeight: 0.5,
    rotation: 0,
    scale: 0.75,
    anchor: new google.maps.Point(30, 60),
  };

  // const icons = {
  //   // origin: {
  //   //   icon: iconBase + "parking_lot_maps.png",
  //   // },
  //   // library: {
  //   //   icon: iconBase + "library_maps.png",
  //   // },
  //   // info: {
  //   //   icon: iconBase + "info-i_maps.png",
  //   // },
  // };

  // The location of FISD Admin
  // The map, centered at FISD Admin by default
  map = new google.maps.Map(document.getElementById("app-map"), {
    zoom: 14,
    center: pos,
    mapTypeId: "roadmap",
  });

  // The marker, positioned at FISD Admin
  const marker = new google.maps.Marker({
    position: pos,
    map: map,
    // icon: markerHome,
    icon: markerHome,
  });

  //Display Data on map for each valid zone/school
  for (let i = 0; i < listOfValidZones.length; i++) {
    const contentString = /*html*/ `
    <div>
      <h3>${listOfValidZones[i].name}</h3>
      <ul>
        <li>${listOfValidZones[i].grades}</li>
      </ul>
    </div>
    `;

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: listOfValidZones[i].name,
    });

    for (const iterator of listOfValidZones[i].border) {
      new google.maps.Polygon({
        path: nestedArrayToObjects(iterator[0]),
        geodesic: true,
        strokeColor: listOfValidZones[i].color,
        strokeOpacity: 1,
        fillColor: listOfValidZones[i].color,
        fillOpacity: 0.1,
        strokeWeight: 2,
      }).setMap(map);

      let mark = new google.maps.Marker({
        position: listOfValidZones[i].location,
        map: map,
        label: `${numToAlpha(i)}`,
        title: listOfValidZones[i].name,
        sclae: 0.75,
      });

      mark.addListener("click", () => {
        infowindow.open({
          anchor: mark,
          map,
        });
      });
    }
  }
}

// ========================Actual "Is It Within Ze Polygon" Logic========================
const onLine = (l1, p) => {
  if (
    p[0] <= Math.max(l1[0][0], l1[1][0]) &&
    p[0] >= Math.min(l1[0][0], l1[1][0]) &&
    p[1] <= Math.max(l1[0][1], l1[1][1]) &&
    p[1] >= Math.min(l1[0][1], l1[1][1])
  ) {
    return true;
  } else return false;
};

const direction = (a, b, c) => {
  let val = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);
  if (val == 0)
    // Colinear
    return 0;
  else if (val < 0)
    // Anti-clockwise direction
    return 2;
  // Clockwise direction
  return 1;
};

const isIntersect = (l1, l2) => {
  let dir1 = direction(l1[0], l1[1], l2[0]);
  let dir2 = direction(l1[0], l1[1], l2[1]);
  let dir3 = direction(l2[0], l2[1], l1[0]);
  let dir4 = direction(l2[0], l2[1], l1[1]);

  // When intersecting
  if (dir1 != dir2 && dir3 != dir4) return true;
  // When p2 of line2 are on the line1
  if (dir1 == 0 && onLine(l1, l2[0])) return true;
  // When p1 of line2 are on the line1
  if (dir2 == 0 && onLine(l1, l2[1])) return true;
  // When p2 of line1 are on the line2
  if (dir3 == 0 && onLine(l2, l2[0])) return true;
  // When p1 of line1 are on the line2
  if (dir4 == 0 && onLine(l2, l1[1])) return true;
  return false;
};

const checkInside = (poly, p) => {
  // console.log("checkInside: ", poly, p);
  // When polygon has less than 3 edge, it is not polygon
  let n = poly.length;
  if (n < 3) return false;

  // Create a point at infinity, y is same as point p
  const exline = [p, [9999, p[1]]];
  let count = 0;
  let i = 0;
  do {
    // Forming a line from two consecutive points of
    // poly
    const side = [poly[i], poly[(i + 1) % n]];
    if (isIntersect(side, exline)) {
      // If side is intersects exline
      if (direction(side[0], p, side[1]) == 0) return onLine(side, p);
      count++;
    }
    i = (i + 1) % n;
  } while (i != 0);

  // When count is odd, return true, else false
  return count & 1;
};
