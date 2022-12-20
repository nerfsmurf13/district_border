const submitButton = document.getElementById("checkLoc");
const domAddressInput = document.getElementById("dom-address-input");
const domX = document.getElementById("dom-x");
const domY = document.getElementById("dom-y");
// const domResult = document.getElementById("dom-result");
const domResults = document.getElementById("dom-results");
// const domAddress = document.getElementById("dom-address");
const apiKey = "AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM";

const originInput = document.getElementById("dom-address");
const autocompleteArea = document.getElementById("autocomplete-area");
// let input

// let data2 = "";
let searching = true;
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

  for (let i = 0; i < borders.length; i++) {
    const element = borders[i];
    // console.log(borders[i].border.length);
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
  // console.log(listOfValidZones);

  drawResults();
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

//=========================Draw Results==============================
function clearResults() {}
function drawResults() {
  domResults.innerHTML = "";
  rawHtml = "";
  for (const [i, result] of listOfValidZones.entries()) {
    // rawHtml += `<div>${result.name} | ${result.address}</div>`;
    // if (result.location)
    rawHtml += `<li class="rounded pl-2 bg-[${result.color}] flex outline outline-1 outline-black/25">
    <span class="bg-white p-1 flex grow"><strong class="mx-1">${i}.</strong> ${result.name} | Grades: ${result.grades} | ${result.address}</span>
  </li>`;
    console.log(result);
    // console.log(test);
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

  //Autocomplete
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
    types: ["establishment"],
  };
  const geocoder = new google.maps.Geocoder();
  const autocomplete = new google.maps.places.Autocomplete(domAddressInput, options);

  const markerHome = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };
  // The location of FISD Admin
  // The map, centered at FISD Admin
  const map = new google.maps.Map(document.getElementById("app-map"), {
    zoom: 12,
    center: pos,
    mapTypeId: "terrain",
    icon: markerHome,
  });

  // The marker, positioned at FISD Admin
  const marker = new google.maps.Marker({
    position: pos,
    map: map,
    icon: markerHome,
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
      // console.log(locInfo.results[0].geometry.location);
      // domAddress.value = result.results[0].formatted_address;
      // let latlng = `${result.results[0].geometry.location.lat}, ${result.results[0].geometry.location.lng}`;
      // console.log(latlng);
      // domGoogle.value = latlng;
    }
    getGeocoding2(listOfValidZones[i].address);
    // console.log(listOfValidZones[i])

    // console.log(tempPos);
    borderCollection.push(nestedArrayToObjects(listOfValidZones[i].border));

    // if (locInfo.status == "OK") {
    //   new google.maps.Marker({
    //     position: locInfo.results[0].geometry.location,
    //   }).setMap(map);
    // }

    polyCollection.push(
      new google.maps.Polyline({
        path: nestedArrayToObjects(listOfValidZones[i].border),
        geodesic: true,
        strokeColor: listOfValidZones[i].color,
        strokeOpacity: 1.0,
        strokeWeight: 2,
      }).setMap(map)
    );

    new google.maps.Marker({
      position: listOfValidZones[i].location,
      map: map,
      label: `${i}`,
    });
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
