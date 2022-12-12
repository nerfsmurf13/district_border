// import { borders } from "./borders";

//Latitude is the Y axis, longitude is the X axis
let bigBorder = [];

// console.log(borders);

let unknown = [
  [-96.8884161, 33.2168349],
  [-96.8873545, 33.2167846],
  [-96.8881921, 33.2171588],
  [-96.8884161, 33.2168349],
];

// fetch("border.json")
//   .then((response) => response.json())
//   .then((json) => (bigBorder = json));

let coords = [];

const submitButton = document.getElementById("checkLoc");
const submitAddress = document.getElementById("checkAddress");
const domGoogle = document.getElementById("dom-google");
const domX = document.getElementById("dom-x");
const domY = document.getElementById("dom-y");
const domResult = document.getElementById("dom-result");
const domAddress = document.getElementById("dom-address");

const originInput = document.getElementById("dom-address");
const autocompleteArea = document.getElementById("autocomplete-area");

let data2 = "";
let searching = true;
let listOfValidZones = [];
async function getGeocoding() {
  let query = encodeURI(domAddress.value);
  let data = null;
  console.log("calling");
  const result = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM`
  ).then((response) => (res = response.json()));
  console.log(result.results[0]);
  domAddress.value = result.results[0].formatted_address;
  let latlng = `${result.results[0].geometry.location.lat}, ${result.results[0].geometry.location.lng}`;
  console.log(latlng);
  domGoogle.value = latlng;

  for (let i = 0; i < borders.length; i++) {
    const element = borders[i];
    // console.log(element.length);
    console.log(borders[i].border.length);
    let verdict = checkInside(borders[i].border, [
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
        color: borders[i].color ? borders[i].color : `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        border: borders[i].border,
      };
      listOfValidZones.push(entry);
    }
  }
  console.log(listOfValidZones);

  // let verdict = checkInside(borders.dentonCountyLine, [
  //   result.results[0].geometry.location.lng,
  //   result.results[0].geometry.location.lat,
  // ]);
  // let verdict = checkInside(bigBorder, [
  //   result.results[0].geometry.location.lng,
  //   result.results[0].geometry.location.lat,
  // ]);
  // if (verdict) {
  //   // domResult.innerText = "This is within Frisco ISD";
  //   domResult.innerHTML = "<p class='px-2 bg-green-500 text-white'>This is within Frisco ISD</p>";
  // } else {
  //   // domResult.innerText = "This is outside Frisco ISD";
  //   domResult.innerHTML = "<p class='px-2 bg-red-500 text-white'>This is NOT within Frisco ISD</p>";
  // }

  initMap(result.results[0].geometry.location);
}

function nestedArrayToObjects(x) {
  newObj = [];
  for (i of x) {
    let temp = { lat: i[1], lng: i[0] };
    newObj.push(temp);
  }
  console.log(`Processed polygon, ${x.length} edges.`);
  return newObj;
}

//=========================Drawing on Maps==============================
function initMap(pos) {
  const adminBldg = { lat: 33.12443425433204, lng: -96.79647875401061 };

  if (pos) {
    loc = pos;
  } else {
    loc = adminBldg;
  }

  //Autocomplete
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
    types: ["establishment"],
  };
  const geocoder = new google.maps.Geocoder();
  const autocomplete = new google.maps.places.Autocomplete(domAddress, options);

  // The location of FISD Admin
  // The map, centered at FISD Admin
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: loc,
    mapTypeId: "terrain",
  });

  // The marker, positioned at FISD Admin
  const marker = new google.maps.Marker({
    position: loc,
    map: map,
  });
  autocomplete.bindTo("bounds", map);

  let borderCollection = [];
  let polyCollection = [];

  for (let i = 0; i < listOfValidZones.length; i++) {
    // const element = array[i];

    let locInfo = null;
    async function getGeocoding2(x) {
      let query = encodeURI(x);
      console.log("calling");
      const smallResult = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM`
      ).then((response) => (res = response.json()));
      locInfo = smallResult;
      // locInfo = `${result.results[0].geometry.location.lat}, ${result.results[0].geometry.location.lng}`;
      console.log(locInfo);
      // domAddress.value = result.results[0].formatted_address;
      // let latlng = `${result.results[0].geometry.location.lat}, ${result.results[0].geometry.location.lng}`;
      // console.log(latlng);
      // domGoogle.value = latlng;
    }
    getGeocoding2(listOfValidZones[i].address);
    console.log(listOfValidZones[i]);

    console.log();
    borderCollection.push(nestedArrayToObjects(listOfValidZones[i].border));
    polyCollection.push(
      new google.maps.Polyline({
        path: nestedArrayToObjects(listOfValidZones[i].border),
        geodesic: true,
        strokeColor: listOfValidZones[i].color,
        strokeOpacity: 1.0,
        strokeWeight: 2,
      }).setMap(map)
    );

    // new google.maps.Marker({
    //   position: geocoder.geocode({ placeId: listOfValidZones[i].address }).then(({ results }) => {
    //     console.log(results);
    //   }),
    //   map: map,
    // });
  }
  console.log(borderCollection);
}
// ========================Actual Polygon Logic========================

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

  // When count is odd
  return count & 1;
};
