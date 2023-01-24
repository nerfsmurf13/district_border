function initialize() {
  // initMap();
  // initAutocomplete();
}

//DOM Elements
const domAddressInput = document.getElementById("dom-address-input");
const domAutocomplete = document.getElementById("dom-autocomplete");
const domResults = document.getElementById("dom-results");
const domGoogleResults = document.getElementById("dom-google-results");
let listOfValidZones = [];

let addressPoints;
let autocompleteSelectedIndex = 0;
let results = [];
let googleResults = [];
let origin = [];
let address;

fetch("./addressPoints.json")
  .then((response) => response.text())
  .then((data) => {
    addressPoints = JSON.parse(data);
  });

domAddressInput.addEventListener("input", () => {
  autocompleteSelectedIndex = 0;
  drawAutocomplete();
});

document.addEventListener("keydown", (e) => {
  if (domAutocomplete.getElementsByTagName("li").length != 0) {
    if (e.key == "ArrowDown") {
      console.log("down pressed");
      console.log(domAutocomplete.getElementsByTagName("li").length);
      autocompleteSelectedIndex++;
      if (autocompleteSelectedIndex > domAutocomplete.getElementsByTagName("li").length - 1) {
        autocompleteSelectedIndex = 0;
      }
    }
    if (e.key == "ArrowUp") {
      console.log("up pressed");
      autocompleteSelectedIndex--;
      if (autocompleteSelectedIndex < 0) {
        autocompleteSelectedIndex = domAutocomplete.getElementsByTagName("li").length - 1;
      }
    }
    // if (e.key == "Enter") {
    //   console.log("Enter Event - Autocomplete results Found");
    //   startSearch(autocompleteSelectedIndex);
    // }
  } else {
    // if (e.key == "Enter") {
    //   console.log("Enter Event - no autocomplete results");
    //   startSearch();
    // }
  }
  drawAutocomplete();
});

document.addEventListener("click", () => {
  hideAutocomplete();
});
function showAutocomplete() {
  if (domAutocomplete.classList.contains("hidden")) {
    domAutocomplete.classList.remove("hidden");
  }
}
function hideAutocomplete() {
  if (!domAutocomplete.classList.contains("hidden")) {
    domAutocomplete.classList.add("hidden");
  }
}
function drawAutocomplete() {
  showAutocomplete();
  domAutocomplete.innerHTML = "";
  if (domAddressInput.value.length >= 3) {
    results = addressPoints.filter((el) => el.address.toLowerCase().includes(domAddressInput.value.toLowerCase()));
    domAutocomplete.innerHTML = results
      .slice(0, 10)
      .map((x, index) => {
        if (index === autocompleteSelectedIndex) {
          return /*html*/ `<li value=${index} style="margin: 0 15px;"><strong> ${x.address}, ${x.city}, ${x.zip} </strong></li>`;
        } else {
          return /*html*/ `<li value=${index} style="margin: 0 15px;">${x.address}, ${x.city}, ${x.zip}</li>`;
        }
      })
      .join("");

    // console.log(domAutocomplete.getElementsByTagName("li"));
    for (let i = 0; i < domAutocomplete.getElementsByTagName("li").length; i++) {
      domAutocomplete.getElementsByTagName("li")[i].addEventListener("mousedown", (e) => {
        autocompleteSelectedIndex = e.target.value;
        setOrigin(i);
      });
    }
  }
}

//i = autocompleteselectedindex
function setOrigin() {
  if (results.length > 0 && domAddressInput.value.length >= 3) {
    origin = results[autocompleteSelectedIndex];
    console.log(origin);
    checkZones(origin.long, origin.lat);
    //Comment out below to remove autofill
    domAddressInput.value = `${origin.address}`;
  } else {
    if (domAddressInput.value.length >= 3) {
      console.log("no origin, going to geocode");
      googleGeocode();
      // checkZones(origin.long, origin.lat);
    }
  }
}

async function googleGeocode() {
  console.log("Google Coords");
  let query = encodeURI(domAddressInput.value + " texas");
  const googleResult = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM`
  ).then((response) => (res = response.json()));
  console.log(googleResult);
  if (googleResult.status == "OK") {
    origin.address = googleResult.results[0].formatted_address;
    if (googleResult.results) {
      console.log("google results found");
      checkZones(googleResult.results[0].geometry.location.lng, googleResult.results[0].geometry.location.lat);
    } else {
      console.log("nothing found");
    }
  }
}

//Global varible that stores school data that contains users address
function checkZones(inputLng, inputLat) {
  console.log("checkZones Fired!");
  listOfValidZones = [];
  let insideDistrict;
  let count = 0;

  for (let i = 0; i < borders.length; i++) {
    const localBorders = borders[i].border;
    for (specificBorder of localBorders) {
      // console.log(specificBorder[0]);
      insideDistrict = checkInside(specificBorder[0], [inputLng, inputLat]);
      if (insideDistrict) {
        count++;
        let entry = {
          name: borders[i].name,
          grades: borders[i].grades,
          type: borders[i].type,
          address: borders[i].address,
          location: borders[i].location,
          color: colorfy(i),
          border: borders[i].border,
        };
        listOfValidZones.push(entry);
      }
    }
  }
  console.log(listOfValidZones);
  drawResults(count);
  return listOfValidZones;
}

function startSearch() {
  origin = {};
  console.log("SEARCHING");
  domResults.innerHTML = "";
  hideAutocomplete();
  setOrigin();
}

//=========================Draw Results==============================
// function clearResults() {}

// drawResults(resultInput : Object | insideDistrictBoolean = : Boolean)
function drawResults(insideDistrictCounter) {
  console.log("drawResults Function");
  domResults.innerHTML = "";

  rawHtml = "";

  if (origin) {
    rawHtml = `<li>
    <span style="padding-left: 5px;"> Results for ${origin.address}</span>
  </li>`;
  }

  if (domAddressInput.value.length < 3) {
    console.log("search short");
    rawHtml += `
      <li>
        <div style="display: flex; border-radius: 4px; overflow: hidden; border: #184366 1px solid">
          <div style="background-color: red; width: 10px"></div>
          <div>
            <span style="padding-left: 5px;"> Sorry, '${domAddressInput.value}' is too short of a request!</span>
          </div>
        </div>
      </li>
    `;
    domResults.innerHTML = rawHtml;
    return;
  }

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
            <span style="padding-left: 5px;">'${origin.address}' is out of district !</span>
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
          <div style="display: flex; border-radius: 4px; overflow: hidden; border: ${colorfy(i)} 1px solid">
            <div style="background-color: ${colorfy(i)}; width: 10px"></div>
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

// for (const item of addressPoints[0]) {
//   console.log(item);
// }

//These colors make up the possible colors of the results which do not have a color specified (i.e. elementary schools)
function colorfy(x) {
  const colorOptions = ["#184366", "#e8b20f", "#0e987d", "#e95b37", "#5ab3c4"];
  return `${colorOptions[(digit = x % colorOptions.length)]}`.trim();
}

let districtMap;

// Utility Function to Convert 0-indexed numbers to alphabet. 0=>A , 25=>Z, 26=>AA, 55=>BD
function numToAlpha(x) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const divide = 26;
  if (x < 0 || x > 701) {
    console.log("function numToAlpha(x)'s Input is too large. 0-701");
    return "Bad Input";
  }
  if (x < divide) {
    return alphabet[x];
  } else {
    return `${alphabet[Math.floor(x / divide) - 1]}${alphabet[(digit = x % divide)]}`.trim();
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
