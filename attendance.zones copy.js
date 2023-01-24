function initialize() {
  initMap();
  // initAutocomplete();
}

//DOM Elements
const domAddressInput = document.getElementById("dom-address-input");
const domAutocomplete = document.getElementById("dom-autocomplete");
const domResults = document.getElementById("dom-results");
const domGoogleResultsSection = document.getElementById("dom-google-results-section");
const domGoogleResults = document.getElementById("dom-google-results");

//Array for zones that contain the Origin Coordinates
let listOfValidZones = [];

let addressPoints;
let autocompleteOpen = false;
let autocompleteSelectedIndex = 0;
let autocompleteResults = [];
let googleResults = [];
let origin = { a: "", c: "", y: "", x: "", z: "" };
let address;

//Fetch JSON
fetch("./addressPointsMinified.json")
  .then((response) => response.text())
  .then((data) => {
    addressPoints = JSON.parse(data);
  });

//Address Field Event Listener
domAddressInput.addEventListener("input", (e) => {
  if (e.key != "Escape" || e.key != "Enter") {
    console.log("input changed");
    console.log(autocompleteOpen);
    autocompleteSelectedIndex = 0;

    drawAutocomplete();
  }
});

//Controls Autocomplete Navigation w/ arrows
document.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (domAutocomplete.getElementsByTagName("li").length != 0) {
    if (e.key == "ArrowDown") {
      autocompleteSelectedIndex++;
      if (autocompleteSelectedIndex > domAutocomplete.getElementsByTagName("li").length - 1) {
        autocompleteSelectedIndex = 0;
      }
      drawAutocomplete();
    }
    if (e.key == "ArrowUp") {
      autocompleteSelectedIndex--;
      if (autocompleteSelectedIndex < 0) {
        autocompleteSelectedIndex = domAutocomplete.getElementsByTagName("li").length - 1;
      }
      drawAutocomplete();
    }
  }
});

//Click event listener for closing autocomplete
document.addEventListener("click", () => {
  console.log("click");
  hideAutocomplete();
});

//Escape listener for closing autocomplete
document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    console.log("esc");
    hideAutocomplete();
  }
});

//Autocomplete visibility
function showAutocomplete() {
  console.log("showac");
  if (domAutocomplete.classList.contains("hidden")) {
    domAutocomplete.classList.remove("hidden");
    autocompleteOpen = true;
  }
}
function hideAutocomplete() {
  console.log("hideac");
  if (!domAutocomplete.classList.contains("hidden")) {
    domAutocomplete.classList.add("hidden");
    autocompleteOpen = false;
  }
}

//Google Results visibility
function showGoogleResults() {
  console.log("showgr");
  if (domGoogleResultsSection.classList.contains("hidden")) {
    domGoogleResultsSection.classList.remove("hidden");
  }
}
function hideGoogleResults() {
  console.log("hidegr");
  if (!domGoogleResultsSection.classList.contains("hidden")) {
    domGoogleResultsSection.classList.add("hidden");
  }
}

//Autocomplete Building/Drawing
function drawAutocomplete() {
  if (domAddressInput.value.length >= 3) {
    console.log("drawAC");

    domAutocomplete.innerHTML = "";

    autocompleteResults = addressPoints.filter((el) =>
      el.a.toLowerCase().includes(domAddressInput.value.toLowerCase())
    );

    domAutocomplete.innerHTML = autocompleteResults
      .slice(0, 10)
      .map((x, index) => {
        if (index == autocompleteSelectedIndex) {
          //Highlighted Item HTML
          return /*html*/ `<li value=${index} style="padding: 0 15px; background-color:#184366;color:white;">${
            x.a
          }, ${cityFullName(x.c)}</li>`;
        } else {
          //Item HTML
          return /*html*/ `<li value=${index} style="padding: 0 15px;">${x.a}, ${cityFullName(x.c)}</li>`;
        }
      })
      .join("");

    //add click listeners to these autocomplete items
    for (let i = 0; i < domAutocomplete.getElementsByTagName("li").length; i++) {
      domAutocomplete.getElementsByTagName("li")[i].addEventListener("mousedown", (e) => {
        e.stopPropagation();
        autocompleteSelectedIndex = e.target.value;
        setOrigin();
      });
    }
    if (autocompleteResults.length == 0) {
      hideAutocomplete();
    } else {
      showAutocomplete();
    }
    console.log(autocompleteResults);
  }
}

//the origin object is referenced by the "checkZones" function.
//This function builds the origin object
//if the address is found from JSON (if in autocomplete), load the coords from that
//if not, call out to google API to get a list of results.
//Once one of those results are clicked, load that info into the origin object.
//Might bypass this function and go straight to checkZones...
function setOrigin() {
  console.log("setOrigin");
  console.log(autocompleteOpen);
  //if autocomplete has reesults and address field has 3>= chars and autocomplete window open
  if (autocompleteOpen) {
    origin = autocompleteResults[autocompleteSelectedIndex];

    console.log(origin);
    checkZones(origin.x, origin.y);
    initMap((pos = { lat: origin.y, lng: origin.x }));
    //Comment out below to remove autofill
    domAddressInput.value = `${origin.a}`;
  } else {
    origin = { a: "", c: "", y: "", x: "", z: "" };
    console.log("no origin, going to geocode");
    googleGeocode();
  }
}

//This function queries google for addresses
async function googleGeocode() {
  console.log("GoogleGeocode");
  googleResults = [];
  domGoogleResults.innerHTML = "<li>No results!</li>";
  let query = encodeURI(domAddressInput.value);
  let bounds1 = "32.97326554735735, -97.00557582118661";
  let bounds2 = "33.27755317807131, -96.57877088052682";
  let bounds = encodeURI(`${bounds1}|${bounds2}`);
  await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&bounds=${bounds}&key=AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM`
  )
    .then((response) => (res = response.json()))
    .then((res) => {
      console.log(res);
      if (res.results.length > 0) {
        for (x of res.results) {
          console.log(x);
          if (x.types.some((r) => ["premise", "street_address", "subpremise", "plus_code"].indexOf(r) >= 0)) {
            googleResults.push(x);
          }
        }
        console.log(googleResults);
        if (googleResults.length > 0) {
          domGoogleResults.innerHTML = googleResults
            .slice(0, 10)
            .map((x, index) => {
              return /*html*/ `<li value=${index} style="margin: 0 15px;"><strong> ${x.formatted_address} </strong></li>`;
            })
            .join("");
        } else {
          domGoogleResults.innerHTML = /*html*/ `<li style="margin: 0 15px;"><strong> No Results Found! </strong></li>`;
        }
      }

      showGoogleResults();
    });
  for (let i = 0; i < domGoogleResults.getElementsByTagName("li").length; i++) {
    domGoogleResults.getElementsByTagName("li")[i].addEventListener("mousedown", (e) => {
      origin.a = googleResults[i].formatted_address;
      origin.x = googleResults[i].geometry.location.lat;
      origin.y = googleResults[i].geometry.location.lng;
      initMap((pos = { lat: origin.x, lng: origin.y }));
      console.log(origin);
      checkZones(origin.y, origin.x);
      hideGoogleResults();
    });
  }
}

function cityFullName(x) {
  if (x == "P") return "PLANO";
  if (x == "F") return "FRISCO";
  if (x == "LE") return "LITTLE ELM";
  return x;
}

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
  origin = { a: "", c: "", y: "", x: "", z: "" };

  console.log("SEARCHING");
  domGoogleResults.innerHTML = "";
  domResults.innerHTML = "";

  setOrigin();
  hideGoogleResults();
  hideAutocomplete();
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
    <span style="padding-left: 5px;"> Results for ${origin.a}</span>
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
            <span style="padding-left: 5px;">'${origin.a}' is out of district !</span>
          </div>
        </div>
      </li>
    `;
    domResults.innerHTML = rawHtml;
    return;
  }

  if (insideDistrictCounter > 0) {
    for (const [i, result] of listOfValidZones.entries()) {
      rawHtml += /*html*/ `
        <li style="display: flex; border-radius: 4px; overflow: hidden; border: ${colorfy(i)} 1px solid;">
          <div style="background-color: ${colorfy(
            i
          )}; color: white; text-align:center; padding: .5rem;display:flex; flex-direction:column; justify-content:center">
              <div>Grades</div>
              <div style="font-size:20px">${result.grades}</div>
          </div>
          <div style="padding:.5rem; margin-left: 1rem; margin: auto 0">
            <div style=" font-size:30px">${result.name}</div>
            <div>${result.address}</div>
          </div>
        </li>
      `;
      console.log(result);
    }
    domResults.innerHTML = rawHtml;
    return;
  }
}

//These colors make up the possible colors of the results which do not have a color specified (i.e. elementary schools)
function colorfy(x) {
  const colorOptions = ["#184366", "#0e987d", "#e95b37", "#5ab3c4"];
  return `${colorOptions[(digit = x % colorOptions.length)]}`.trim();
}

let districtMap;

// function moveMap(lat, lng) {
//   districtMap.panTo(new google.maps.LatLng(lat, lng));
// }

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

  // The location of FISD Admin
  // The map, centered at FISD Admin by default
  districtMap = new google.maps.Map(document.getElementById("app-map"), {
    zoom: 14,
    center: pos,
    mapTypeId: "roadmap",
  });

  // The marker, positioned at FISD Admin
  const marker = new google.maps.Marker({
    position: pos,
    map: districtMap,
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
      }).setMap(districtMap);

      let mark = new google.maps.Marker({
        position: listOfValidZones[i].location,
        map: districtMap,
        label: `${numToAlpha(i)}`,
        title: listOfValidZones[i].name,
        sclae: 0.75,
      });

      mark.addListener("click", () => {
        infowindow.open({
          anchor: mark,
          map: districtMap,
        });
      });
    }
  }
}

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
const checkInside = (poly, p) => {
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
