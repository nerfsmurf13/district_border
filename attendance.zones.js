function initialize() {
  // initMap();
  // initAutocomplete();
}

//DOM Elements
const domAddressInput = document.getElementById("dom-address-input");
const domAutocomplete = document.getElementById("dom-autocomplete");
const domResults = document.getElementById("dom-results");
let addressPoints;
let autocompleteSelectedIndex = 0;
let autocompleteVisible = false;
let origin = [];
let address;
fetch("./addressPoints.json")
  .then((response) => response.text())
  .then((data) => {
    addressPoints = JSON.parse(data);
    // console.log(addressPoints);
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
    if (e.key == "Enter") {
      console.log("Entered");
      address = checkZones();
      // autocompleteSelectedIndex--;
      // if (autocompleteSelectedIndex < 0) {
      //   autocompleteSelectedIndex = domAutocomplete.getElementsByTagName("li").length - 1;
      // }
    }
  } else {
    if (e.key == "Enter") {
      console.log("Entered, but no results");
    }
  }
  drawAutocomplete();
});

function drawAutocomplete() {
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

    console.log(domAutocomplete.getElementsByTagName("li"));
    for (let i = 0; i < domAutocomplete.getElementsByTagName("li").length; i++) {
      domAutocomplete.getElementsByTagName("li")[i].addEventListener("mousedown", (e) => {
        autocompleteSelectedIndex = e.target.value;
        console.log(autocompleteSelectedIndex);
        drawAutocomplete();
      });
    }
  }
}

function googleGeocode() {
  console.log("Google Coords");
}

function checkZones() {
  origin = "asd";
  console.log("checkZones Fired!");
}

// for (const item of addressPoints[0]) {
//   console.log(item);
// }

//These colors make up the possible colors of the results which do not have a color specified (i.e. elementary schools)
const colorOptions = ["#184366", "#e8b20f", "#0e987d", "#e95b37", "#5ab3c4"];

//Global varible that stores school data that contains users address
let listOfValidZones = [];

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
