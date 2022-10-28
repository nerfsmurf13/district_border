console.log("app2");
console.log("Im alive");

// Create the script tag, set the appropriate attributes
// var script = document.createElement("script");
// script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBMobqGzdmYFvsxeZJ3YunRull6NYefekM&callback=initMap";
// script.async = true;

// // Attach your callback function to the `window` object
// // window.initMap = function () {
// //   // JS API is loaded and available
// // };

// // Append the 'script' element to 'head'
// document.head.appendChild(script);

let bigBorder = [];

fetch("border.json")
  .then((response) => response.json())
  .then((json) => (bigBorder = json));

let anotherArr = [
  [-96.900654, 33.124557],
  [-96.900686, 33.124562],
  [-96.900628, 33.124173],
  [-96.900615, 33.124099],
  [-96.900655, 33.124045],
  [-96.900854, 33.123785],
  [-96.901111, 33.123602],
  [-96.901426, 33.123449],
  [-96.901027, 33.12253],
  [-96.900041, 33.121468],
  [-96.900839, 33.120808],
  [-96.900876, 33.120152],
  [-96.900873, 33.120115],
  [-96.89962, 33.120095],
  [-96.896688, 33.120043],
  [-96.896754, 33.114705],
  [-96.896776, 33.112921],
  [-96.896792, 33.111601],
  [-96.896812, 33.110014],
  [-96.892052, 33.109962],
  [-96.892058, 33.110892],
  [-96.892065, 33.112681],
  [-96.889592, 33.112663],
  [-96.889534, 33.112665],
  [-96.889332, 33.1127],
  [-96.889276, 33.112718],
  [-96.889168, 33.112764],
  [-96.888876, 33.112928],
  [-96.88841, 33.112338],
  [-96.888335, 33.112287],
  [-96.888305, 33.112279],
  [-96.888213, 33.112287],
  [-96.888161, 33.112315],
  [-96.887877, 33.112557],
  [-96.887488, 33.112199],
  [-96.887189, 33.112448],
  [-96.887148, 33.112507],
  [-96.887028, 33.112507],
  [-96.884249, 33.112471],
  [-96.884196, 33.115231],
  [-96.883959, 33.115244],
  [-96.883979, 33.115689],
  [-96.883814, 33.115725],
  [-96.883647, 33.11576],
  [-96.88349, 33.115817],
  [-96.883358, 33.115907],
  [-96.883229, 33.116035],
  [-96.88274, 33.11576],
  [-96.882534, 33.11608],
  [-96.882036, 33.116029],
  [-96.869189, 33.115954],
  [-96.869215, 33.114512],
  [-96.869203, 33.114512],
  [-96.869196, 33.11441],
  [-96.865225, 33.114359],
  [-96.864715, 33.114318],
  [-96.864397, 33.114079],
  [-96.864285, 33.114232],
  [-96.863782, 33.114074],
  [-96.863703, 33.114288],
  [-96.862954, 33.114067],
  [-96.862818, 33.11441],
  [-96.862732, 33.114395],
  [-96.862397, 33.114331],
  [-96.86209, 33.114324],
  [-96.862083, 33.114173],
  [-96.861093, 33.114169],
  [-96.861088, 33.114252],
  [-96.860553, 33.114245],
  [-96.860556, 33.114305],
  [-96.860586, 33.115016],
  [-96.851421, 33.114945],
  [-96.848668, 33.114976],
  [-96.84407, 33.114988],
  [-96.843423, 33.114975],
  [-96.843317, 33.114888],
  [-96.841683, 33.114864],
  [-96.841595, 33.114862],
  [-96.841676, 33.110541],
  [-96.841753, 33.109751],
  [-96.841699, 33.108485],
  [-96.841578, 33.107312],
  [-96.841527, 33.106808],
  [-96.841578, 33.106795],
  [-96.841912, 33.097652],
  [-96.841833, 33.09644],
  [-96.841887, 33.094308],
  [-96.841622, 33.093865],
  [-96.841905, 33.093633],
  [-96.842007, 33.08984],
  [-96.842206, 33.089607],
  [-96.842372, 33.089413],
  [-96.842493, 33.083046],
  [-96.842393, 33.083047],
  [-96.832094, 33.082897],
  [-96.832051, 33.084258],
  [-96.828865, 33.084247],
  [-96.826694, 33.084284],
  [-96.825808, 33.084239],
  [-96.824626, 33.084189],
  [-96.823998, 33.084148],
  [-96.821559, 33.084141],
  [-96.821518, 33.080997],
  [-96.805143, 33.080958],
  [-96.804589, 33.080928],
  [-96.802556, 33.080903],
  [-96.799231, 33.080864],
  [-96.798083, 33.080828],
  [-96.782598, 33.080786],
  [-96.782621, 33.079791],
  [-96.779848, 33.079809],
  [-96.779816, 33.086156],
  [-96.779735, 33.095775],
  [-96.771833, 33.095712],
  [-96.771594, 33.095771],
  [-96.771529, 33.101101],
  [-96.733454, 33.100827],
  [-96.733448, 33.1059],
  [-96.733445, 33.110847],
  [-96.733372, 33.115638],
  [-96.733376, 33.117076],
  [-96.733653, 33.117481],
  [-96.734405, 33.118519],
  [-96.734473, 33.11862],
  [-96.734593, 33.118796],
  [-96.734986, 33.119535],
  [-96.735066, 33.119987],
  [-96.735062, 33.120051],
  [-96.735059, 33.120115],
  [-96.735057, 33.120178],
  [-96.735056, 33.120242],
  [-96.735055, 33.120306],
  [-96.735055, 33.12037],
  [-96.735055, 33.120433],
  [-96.735056, 33.120497],
  [-96.735058, 33.120561],
  [-96.735061, 33.120624],
  [-96.735064, 33.120688],
  [-96.735067, 33.120752],
  [-96.735072, 33.120815],
  [-96.735069, 33.120874],
  [-96.735067, 33.120932],
  [-96.735066, 33.120991],
  [-96.735065, 33.12105],
  [-96.735065, 33.121108],
  [-96.735066, 33.121167],
  [-96.735067, 33.121225],
  [-96.735069, 33.121284],
  [-96.735072, 33.121342],
  [-96.735075, 33.121401],
  [-96.735079, 33.121459],
  [-96.735084, 33.121518],
  [-96.735089, 33.121576],
  [-96.735096, 33.121634],
  [-96.735102, 33.121693],
  [-96.735259, 33.122476],
  [-96.735271, 33.122541],
  [-96.735347, 33.122754],
  [-96.735575, 33.123398],
  [-96.735877, 33.124076],
  [-96.732672, 33.125149],
  [-96.715816, 33.13119],
  [-96.715787, 33.13487],
  [-96.715932, 33.134876],
  [-96.719098, 33.134882],
  [-96.718737, 33.137623],
  [-96.715753, 33.139089],
  [-96.715706, 33.144953],
  [-96.69837, 33.144749],
  [-96.698301, 33.144754],
  [-96.696521, 33.144877],
  [-96.695735, 33.145037],
  [-96.694401, 33.145538],
  [-96.695418, 33.147322],
  [-96.696512, 33.148601],
  [-96.697146, 33.149187],
  [-96.698213, 33.150001],
  [-96.698601, 33.150282],
  [-96.6982, 33.150806],
  [-96.698181, 33.152434],
  [-96.698501, 33.152655],
  [-96.698184, 33.153176],
  [-96.697121, 33.154918],
  [-96.698192, 33.155361],
  [-96.698207, 33.159074],
  [-96.698274, 33.166653],
  [-96.698271, 33.16728],
  [-96.698268, 33.168082],
  [-96.698268, 33.168176],
  [-96.698282, 33.169694],
  [-96.698302, 33.169974],
  [-96.698303, 33.173489],
  [-96.698303, 33.174164],
  [-96.708086, 33.174209],
  [-96.708115, 33.173604],
  [-96.708824, 33.173571],
  [-96.708838, 33.172108],
  [-96.711558, 33.172126],
  [-96.711561, 33.172312],
  [-96.715589, 33.172356],
  [-96.715717, 33.172353],
  [-96.715667, 33.174243],
  [-96.719009, 33.174322],
  [-96.720395, 33.17457],
  [-96.722061, 33.175053],
  [-96.723004, 33.173462],
  [-96.724067, 33.171518],
  [-96.725172, 33.17051],
  [-96.726283, 33.169807],
  [-96.727784, 33.169177],
  [-96.729309, 33.168824],
  [-96.730991, 33.168644],
  [-96.732961, 33.168759],
  [-96.732932, 33.174318],
  [-96.732937, 33.189088],
  [-96.733097, 33.203528],
  [-96.746615, 33.203551],
  [-96.746536, 33.196286],
  [-96.750733, 33.196263],
  [-96.752748, 33.196446],
  [-96.75342, 33.196871],
  [-96.753641, 33.196698],
  [-96.753737, 33.196675],
  [-96.753828, 33.196717],
  [-96.753891, 33.196653],
  [-96.754224, 33.19634],
  [-96.754372, 33.196234],
  [-96.754559, 33.196119],
  [-96.754991, 33.195892],
  [-96.755465, 33.195718],
  [-96.755989, 33.195604],
  [-96.756453, 33.195559],
  [-96.756968, 33.195557],
  [-96.758466, 33.195559],
  [-96.758949, 33.195495],
  [-96.760625, 33.195449],
  [-96.76073, 33.195838],
  [-96.760874, 33.196093],
  [-96.76091, 33.196141],
  [-96.76117, 33.1964],
  [-96.761194, 33.196416],
  [-96.761546, 33.196649],
  [-96.762167, 33.196886],
  [-96.762418, 33.196429],
  [-96.767796, 33.196544],
  [-96.767777, 33.196419],
  [-96.767843, 33.19111],
  [-96.767827, 33.189097],
  [-96.77659, 33.189154],
  [-96.785183, 33.189222],
  [-96.78877, 33.189331],
  [-96.793845, 33.189358],
  [-96.794612, 33.189574],
  [-96.80279, 33.18967],
  [-96.802828, 33.196806],
  [-96.817338, 33.196702],
  [-96.818444, 33.196713],
  [-96.819902, 33.196784],
  [-96.820102, 33.196647],
  [-96.820203, 33.196382],
  [-96.820447, 33.196263],
  [-96.821045, 33.196247],
  [-96.82277, 33.196265],
  [-96.823121, 33.196254],
  [-96.825834, 33.196296],
  [-96.827164, 33.1964],
  [-96.828498, 33.196338],
  [-96.829632, 33.196355],
  [-96.834548, 33.196485],
  [-96.839315, 33.196408],
  [-96.838832, 33.219215],
  [-96.854515, 33.219252],
  [-96.880263, 33.219054],
  [-96.889714, 33.219324],
  [-96.889716, 33.219309],
  [-96.889773, 33.219176],
  [-96.889883, 33.219031],
  [-96.891577, 33.216791],
  [-96.89175, 33.216793],
  [-96.89186, 33.216185],
  [-96.894003, 33.213661],
  [-96.896435, 33.212238],
  [-96.897384, 33.212251],
  [-96.897599, 33.212253],
  [-96.898817, 33.211804],
  [-96.899768, 33.210792],
  [-96.899893, 33.210658],
  [-96.904069, 33.210712],
  [-96.904323, 33.203843],
  [-96.90464, 33.194107],
  [-96.905106, 33.194096],
  [-96.905185, 33.191819],
  [-96.904727, 33.191815],
  [-96.904302, 33.191812],
  [-96.902939, 33.190281],
  [-96.902441, 33.189929],
  [-96.902525, 33.189502],
  [-96.90252, 33.189497],
  [-96.902186, 33.189136],
  [-96.902018, 33.189202],
  [-96.901658, 33.18888],
  [-96.901062, 33.188448],
  [-96.900183, 33.187905],
  [-96.900573, 33.187341],
  [-96.900721, 33.187039],
  [-96.901057, 33.186329],
  [-96.901187, 33.185871],
  [-96.901423, 33.185108],
  [-96.901545, 33.184327],
  [-96.9015, 33.180339],
  [-96.900265, 33.180375],
  [-96.892923, 33.180281],
  [-96.892341, 33.18004],
  [-96.891821, 33.179779],
  [-96.891591, 33.179551],
  [-96.891358, 33.179564],
  [-96.887485, 33.179514],
  [-96.88727, 33.1795],
  [-96.887291, 33.178395],
  [-96.887489, 33.17629],
  [-96.887533, 33.171929],
  [-96.887593, 33.169312],
  [-96.889483, 33.169343],
  [-96.898399, 33.169486],
  [-96.899313, 33.169262],
  [-96.900917, 33.168617],
  [-96.901466, 33.168414],
  [-96.901374, 33.167019],
  [-96.901276, 33.165524],
  [-96.901321, 33.163448],
  [-96.901385, 33.162712],
  [-96.901431, 33.162183],
  [-96.901472, 33.16054],
  [-96.901454, 33.160509],
  [-96.900803, 33.160074],
  [-96.90081, 33.159659],
  [-96.899549, 33.159634],
  [-96.899498, 33.159636],
  [-96.89944, 33.159222],
  [-96.899428, 33.15835],
  [-96.89953, 33.154823],
  [-96.899489, 33.151451],
  [-96.899537, 33.146707],
  [-96.899593, 33.146566],
  [-96.899675, 33.139401],
  [-96.899663, 33.139332],
  [-96.900386, 33.139317],
  [-96.900396, 33.139322],
  [-96.900561, 33.139322],
  [-96.900561, 33.139316],
  [-96.900769, 33.139298],
  [-96.900759, 33.138394],
  [-96.900702, 33.138022],
  [-96.900601, 33.13786],
  [-96.900625, 33.136955],
  [-96.900588, 33.133316],
  [-96.900581, 33.133288],
  [-96.900583, 33.132579],
  [-96.90085, 33.132333],
  [-96.900653, 33.132192],
  [-96.900533, 33.132088],
  [-96.900644, 33.131856],
  [-96.901016, 33.131381],
  [-96.900596, 33.131117],
  [-96.900709, 33.124753],
  [-96.900654, 33.12455],
];

// var canvas = document.getElementById("html-canvas");
// canvas.width = canvas.clientWidth;
// canvas.height = canvas.clientHeight;
// var context = canvas.getContext("2d");
const apiKey = "AIzaSyAnvwTCDQRQtmYsAie-EYGDoiWCRUh6Yxs";

const submitButton = document.getElementById("checkLoc");
const submitAddress = document.getElementById("checkAddress");
const domGoogle = document.getElementById("dom-google");
const domX = document.getElementById("dom-x");
const domY = document.getElementById("dom-y");
const domResult = document.getElementById("dom-result");
const domAddress = document.getElementById("dom-address");

submitAddress.addEventListener("mouseup", (e) => {
  console.log("click address");
  getGeocoding();
});

submitButton.addEventListener("mouseup", (e) => {
  console.log("click");
  // srcPoint(domX.value, domY.value);
  // checkInside(bigBorder, 366, [domY.value, domX.value]);

  const splitCoords = (x) => {
    console.log(x);
    chunks = x.split(", ");
    console.log(chunks);
    // domX.value = chunks[0];
    // domY.value = chunks[1];
    let verdict = checkInside(bigBorder, 366, [chunks[1], chunks[0]]);
    console.log(verdict);
    if (verdict) {
      domResult.innerText = "This is within Frisco ISD";
    } else {
      domResult.innerText = "This is outside Frisco ISD";
    }
  };

  splitCoords(domGoogle.value);
  // ;
});

let data2 = "";

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
  let verdict = checkInside(bigBorder, 366, [
    result.results[0].geometry.location.lng,
    result.results[0].geometry.location.lat,
  ]);
  if (verdict) {
    domResult.innerText = "This is within Frisco ISD";
  } else {
    domResult.innerText = "This is outside Frisco ISD";
  }
  initMap(result.results[0].geometry.location);
}

function draw() {
  const canvas = document.getElementById("html-canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.fillRect(10, 10, 50, 50);
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 50, 50);
  }
}

function srcPoint(x, y) {
  const canvas = document.getElementById("html-canvas");
  if (x == 0 && y == 0) {
    return;
  }
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const pointSize = 10;
    const range = 9999;
    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.fillRect(x - pointSize / 2, y - pointSize / 2, pointSize, pointSize);
    ctx.fillStyle = "rgb(0,0 ,0 , .5)";
    ctx.fillRect(x, y, range, 1);
  }
}

areaArr = [
  [2, 2],
  [100, 500],
  [150, 599],
  [100, 200],
  [400, 400],
  [500, 275],
];

function drawEdge(x, y, x2, y2) {
  const canvas = document.getElementById("html-canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    console.log("drawing");
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function drawPath(arr) {
  count = 0;
  modifier = 10;
  for (let i = 0; i < arr.length; i++) {
    if (i == arr.length - 1) {
      console.log(arr[i][0] * modifier, arr[i][1] * modifier, arr[0][0] * modifier, arr[0][1] * modifier);
      drawEdge(arr[i][0] * modifier, arr[i][1] * modifier, arr[0][0] * modifier, arr[0][1] * modifier);
      return;
    }
    if (i < arr.length - 1) {
      console.log(arr[i][0] * modifier, arr[i][1] * modifier, arr[i + 1][0] * modifier, arr[i + 1][1] * modifier);
      drawEdge(arr[i][0] * modifier, arr[i][1] * modifier, arr[i + 1][0] * modifier, arr[i + 1][1] * modifier);
    }
    console.log("edge");
    // drawEdge(arr[i][0], arr[i][1], arr[i + 1][0], arr[i + 1][1]);
  }
}
//=========================maps==============================

let completed = [];
function nestedArrayToObjects(x) {
  newObj = [];
  for (i of x) {
    let temp = { lat: i[1], lng: i[0] };
    newObj.push(temp);
    // console.log(newObj);
  }
  console.log(x.length);
  completed = newObj;
  return newObj;
}
nestedArrayToObjects(anotherArr);

// const center = { lat: 50.064192, lng: -130.605469 };
// // Create a bounding box with sides ~10km away from the center point
// const defaultBounds = {
//   north: center.lat + 0.1,
//   south: center.lat - 0.1,
//   east: center.lng + 0.1,
//   west: center.lng - 0.1,
// };
// const input = document.getElementById("dom-address");
// const options = {
//   bounds: defaultBounds,
//   componentRestrictions: { country: "us" },
//   fields: ["address_components", "geometry", "icon", "name"],
//   strictBounds: false,
//   types: ["establishment"],
// };
// const autocomplete = new google.maps.places.Autocomplete(input, options);

function initMap(pos) {
  // The location of FISD Admin
  // const adminBldg = { lat: 33.12443425433204, lng: -96.79647875401061 };
  // The map, centered at FISD Admin
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: pos,
    mapTypeId: "terrain",
  });

  // The marker, positioned at FISD Admin
  const marker = new google.maps.Marker({
    position: pos,
    map: map,
  });
  // const fakePath = [
  //   { lng: -96.900654, lat: 33.12455 },
  //   { lng: -96.900709, lat: 33.124753 },
  //   { lng: -96.900596, lat: 33.131117 },
  // ];
  const districtBorder = new google.maps.Polyline({
    path: completed,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  districtBorder.setMap(map);
  // setTimeout(() => {
  //   console.log("????");
  //   google.maps.event.trigger(map, "resize");
  // }, 3000);
}
// initMap({ lat: 33.12443425433204, lng: -96.79647875401061 });
// window.initMap = initMap;
// ========================actual Logic=-====================

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

const checkInside = (poly, n, p) => {
  // When polygon has less than 3 edge, it is not polygon
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

const demoPolygon = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];

const pos1 = [10, 10];
const pos2 = [1, 1];
const pos3 = [-10, 10];
const pos4 = [10, -10];
const pos5 = [0, 0];

const edges = 4;

// console.log(checkInside(demoPolygon, edges, pos1));
// console.log(checkInside(demoPolygon, edges, pos2));
// console.log(checkInside(demoPolygon, edges, pos3));
// console.log(checkInside(demoPolygon, edges, pos4));
// console.log(checkInside(demoPolygon, edges, pos5));

// drawPath(anotherArr);
// srcPoint(20, 250);
