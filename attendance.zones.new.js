function initialize() {
  initMap();
  initAutocomplete();
}

const addressInput = document.getElementById("dom-address-input");

let map;
let autocomplete;

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(addressInput, options);
}

function initMap(pos = { lat: 33.12443425433204, lng: -96.79647875401061 }) {
  map = new google.maps.Map(document.getElementById("app-map"), {
    zoom: 4,
    center: pos,
  });
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
