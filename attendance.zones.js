//These colors make up the possible colors of the results which do not have a color specified (elementary schools)
const colorOptions = ["#184366", "#e8b20f", "#0e987d", "#e95b37", "#5ab3c4"];
//API key for Google
const apiKey = "AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM";
//DOM Elements
const submitButton = document.getElementById("checkLoc");
const domAddressInput = document.getElementById("dom-address-input");
const domX = document.getElementById("dom-x");
const domY = document.getElementById("dom-y");
const domResults = document.getElementById("dom-results");
const originInput = document.getElementById("dom-address");
const autocompleteArea = document.getElementById("autocomplete-area");

// Convert 0-indexed numbers to alphabet. 0=>A , 25=>Z, 26=>AA, 55=>BD
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

// let searching = true;
let listOfValidZones = [];
async function getGeocoding() {
  listOfValidZones = [];
  let query = encodeURI(domAddressInput.value);
  // let data = null;
  console.log("Fetching!");
  const result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`).then(
    (response) => (res = response.json())
  );
  // console.log(result.results[0]);
  // domAddress.value = result.results[0].formatted_address;
  // let latlng = `${result.results[0].geometry.location.lat}, ${result.results[0].geometry.location.lng}`;

  // console.log(latlng);
  // domAddressInput.value = latlng;

  let colorIndex = 0; //works with "colorOptions"
  function mapColor(x) {
    if (borders[x].color) {
      return borders[x].color;
    }
    let color = colorOptions[colorIndex];
    colorIndex++;
    return color;
  }

  console.log(result.results);

  console.log("Border Entries: " + 0);
  if (result.results.length > 0) {
    for (let i = 0; i < borders.length; i++) {
      const element = borders[i];
      const verdict = checkInside(borders[i].border, [
        result.results[0].geometry.location.lng,
        result.results[0].geometry.location.lat,
      ]);

      if (verdict) {
        let entry = {
          name: borders[i].name,
          grades: borders[i].grades,
          type: borders[i].type,
          address: borders[i].address,
          location: borders[i].location,
          color: colorOptions[i],
          color: mapColor(i),
          // color: borders[i].color ? borders[i].color : '#{Math.floor(Math.random() * 16777215).toString(16)}',
          border: borders[i].border,
        };
        listOfValidZones.push(entry);
      }
    }
    initMap(result.results[0].geometry.location);
  }
  drawResults(result);

  // console.log(listOfValidZones);
}

function nestedArrayToObjects(x) {
  console.log(x);
  newObj = [];
  for (i of x) {
    let temp = { lat: i[1], lng: i[0] };
    newObj.push(temp);
  }
  console.log(`Processed polygon, ${x.length} edges.`);
  return newObj;
}

//=========================Test Function for checking Coverage on map==============================
function checkCoverage(schoolTypeString) {
  let coverageArr = [];
  for (i of borders) {
    // console.log(i);
    if (i.type == schoolTypeString) {
      coverageArr.push(i.border);
    }
  }
  // console.log(coverageArr);
  return coverageArr;
}
let testCoverage = checkCoverage("Elementary");

//=========================Draw Results==============================
function clearResults() {}
// drawResults(resultInput : Object | insideDistrictBoolean = : Boolean)
function drawResults(resultInput, insideDistrictBoolean) {
  let result = resultInput;
  domResults.innerHTML = "";
  rawHtml = "";
  if (result.results.length > 0) {
    for (const [i, result] of listOfValidZones.entries()) {
      // rawHtml += `<div>${result.name} | ${result.address}</div>`;
      // if (result.location)
      //   rawHtml += `<li class="rounded pl-2 bg-[${result.color}] flex outline outline-1 outline-black/25">
      //   <span class="bg-white p-1 flex grow"><strong class="mx-1">${i}.</strong> ${result.name} | Grades: ${result.grades} | ${result.address}</span>
      // </li>`;
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
      // console.log(test);
    }
  } else if (result.results == 0) {
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
  }
  domResults.innerHTML = rawHtml;
}

//=========================Drawing on Maps==============================
function initMap(pos = { lat: 33.12443425433204, lng: -96.79647875401061 }) {
  // const adminBldg = { lat: 33.12443425433204, lng: -96.79647875401061 };

  // if (pos) {
  //   loc = pos;
  // } else {
  //   loc = adminBldg;
  // }

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

  const icons = {
    // origin: {
    //   icon: iconBase + "parking_lot_maps.png",
    // },
    // library: {
    //   icon: iconBase + "library_maps.png",
    // },
    // info: {
    //   icon: iconBase + "info-i_maps.png",
    // },
  };

  //Autocomplete
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
    types: ["establishment"],
  };
  const autocomplete = new google.maps.places.SearchBox(domAddressInput, options);

  // The location of FISD Admin
  // The map, centered at FISD Admin by default
  const map = new google.maps.Map(document.getElementById("app-map"), {
    zoom: 12,
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
  autocomplete.bindTo("bounds", map);

  let borderCollection = [];

  //Display Data on map for each valid zone/school
  for (let i = 0; i < listOfValidZones.length; i++) {
    // if (locInfo.status == "OK") {

    // }
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

    borderCollection.push(nestedArrayToObjects(listOfValidZones[i].border));

    new google.maps.Polygon({
      path: nestedArrayToObjects(listOfValidZones[i].border),
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
      // console.log(e);
      infowindow.open({
        anchor: mark,
        map,
      });
    });
  }
  // let test = [
  //   [-96.79797422283924, 33.09298362704685],
  //   [-96.79861474707513, 33.09345664510581],
  //   [-96.80039510462426, 33.09348257802917],
  //   [-96.80040410984057, 33.09194227419761],
  //   [-96.7968805965496, 33.09185442816792],
  //   [-96.79687119596838, 33.09267969164591],
  //   [-96.79788175069957, 33.09269347925507],
  //   [-96.79797422283924, 33.09298362704685],
  // ];
  // new google.maps.Polygon({
  //   path: nestedArrayToObjects(test),
  //   geodesic: true,
  //   strokeColor: "#000",
  //   strokeOpacity: 1,
  //   fillColor: "#000",
  //   fillOpacity: 0.1,
  //   strokeWeight: 2,
  // }).setMap(map);
  //Display Data on map for each valid zone/school

  for (let i = 0; i < testCoverage.length; i++) {
    console.log(testCoverage);
    borderCollection.push(nestedArrayToObjects(testCoverage[i]));

    new google.maps.Polygon({
      path: nestedArrayToObjects(testCoverage[i]),
      geodesic: true,
      strokeColor: "#000",
      strokeOpacity: 1,
      fillColor: "#000",
      fillOpacity: 0.5,
      strokeWeight: 2,
    }).setMap(map);
  }

  console.log(borderCollection);
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
