const kyivRelocationDate = new Date("1998-08-01");
const todaysDate = new Date();
const monthsLivingInLviv =
  todaysDate.getMonth() -
  kyivRelocationDate.getMonth() +
  12 * (todaysDate.getFullYear() - kyivRelocationDate.getFullYear());
document.getElementById("kyiv-rent-months").innerHTML =
  "paid " +
  monthsLivingInLviv +
  " month" +
  (monthsLivingInLviv === 1 ? "" : "s") +
  " of rent already";

function timer(fromDate, node) {
  const startDate = new Date(fromDate.toISOString().substr(0, 10));
  // const endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
  const endDate = new Date();

  const startYear = startDate.getFullYear();
  const february =
    (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
      ? 29
      : 28;
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let yearDiff = endDate.getFullYear() - startYear;
  let monthDiff = endDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  let dayDiff = endDate.getDate() - startDate.getDate();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.getMonth()];
  }
  const minutes = endDate.getMinutes();
  const seconds = endDate.getSeconds();
  const minutesDiff = minutes < 10 ? "0" + minutes : minutes;
  const secondsDiff = seconds < 10 ? "0" + seconds : seconds;

  node.textContent = `${yearDiff} years ${monthDiff}  month  ${dayDiff} ${
    dayDiff === 1 ? "day" : "days"
  } ${minutesDiff} ${minutes === 1 ? "minute" : "minutes"}
  ${secondsDiff} ${seconds === 1 ? "second" : "seconds"}`;
}


function switchToColor(color) {
  try {
    document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(function(page) {
      page.style.color = color;
    });
    document.querySelectorAll(".page").forEach(function(page) {
      page.style.borderColor = color;
    });
    document.querySelectorAll("a").forEach(function(page) {
      page.style.color = color;
    });
    document.querySelectorAll(".avatar").forEach(function(avatar) {
      avatar.contentDocument
        .getElementById("circle")
        .setAttribute("fill", color);
    });
  } catch (error) {}
}
document
  .getElementById("midnightblue")
  .addEventListener("click", switchToColor.bind(this, "midnightblue"));
document
  .getElementById("chartreuse")
  .addEventListener("click", switchToColor.bind(this, "chartreuse"));
document
  .getElementById("tomato")
  .addEventListener("click", switchToColor.bind(this, "tomato"));
document
  .getElementById("royalblue")
  .addEventListener("click", switchToColor.bind(this, "royalblue"));
document
  .getElementById("deeppink")
  .addEventListener("click", switchToColor.bind(this, "deeppink"));
document
  .getElementById("aqua")
  .addEventListener("click", switchToColor.bind(this, "aqua"));
document
  .getElementById("red")
  .addEventListener("click", switchToColor.bind(this, "red"));
document.getElementById("meh").addEventListener("click", function() {
  this.querySelector("audio").play();
});
function replaceNoscript(noscript) {
  const parent = noscript.parentElement;
  Array.prototype.slice
    .call(
      new DOMParser().parseFromString(noscript.textContent, "text/html").body
        .children
    )
    .forEach(function(element) {
      parent.insertBefore(element, noscript);
    });
  parent.removeChild(noscript);
}
function callFuncOnCollection(collection, func) {
  Array.prototype.slice.call(collection).map(function(item) {
    func(item);
  });
}
const childhoodPhotos = document
  .getElementById("childhood")
  .getElementsByClassName("photos")[0];
document.getElementById("resume").addEventListener("click", function() {
  callFuncOnCollection(
    childhoodPhotos.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
});
if (window.location.hash === "#childhood") {
  callFuncOnCollection(
    childhoodPhotos.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
}
const diplomaKPI = document
  .getElementById("diploma-kpi")
  .getElementsByClassName("photos")[0];
document
  .getElementById("diploma-university")
  .addEventListener("click", function() {
    callFuncOnCollection(
      diplomaKPI.getElementsByTagName("NOSCRIPT"),
      replaceNoscript
    );
  });
if (window.location.hash === "#diploma-kpi") {
  callFuncOnCollection(
    diplomaKPI.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
}
const diplomaEnglish = document
  .getElementById("diploma-english")
  .getElementsByClassName("photos")[0];
document.getElementById("diploma-eng").addEventListener("click", function() {
  callFuncOnCollection(
    diplomaEnglish.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
});
if (window.location.hash === "#diploma-english") {
  callFuncOnCollection(
    diplomaEnglish.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
}
const diplomaEasyCode = document
  .getElementById("diploma-EasyCode")
  .getElementsByClassName("photos")[0];
document.getElementById("diploma-EC").addEventListener("click", function() {
  callFuncOnCollection(
    diplomaEasyCode.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
});
if (window.location.hash === "#diploma-EasyCode") {
  callFuncOnCollection(
    diplomaEasyCode.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
}
const diplomaWebAcademy = document
  .getElementById("diploma-WebAcademy")
  .getElementsByClassName("photos")[0];
document.getElementById("diploma-WA").addEventListener("click", function() {
  callFuncOnCollection(
    diplomaWebAcademy.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
});
if (window.location.hash === "#diploma-WebAcademy") {
  callFuncOnCollection(
    diplomaWebAcademy.getElementsByTagName("NOSCRIPT"),
    replaceNoscript
  );
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js");
  });
}

window.onload = function() {
  const experienceStartDate = new Date("2017-01-01");
  const experienceNode = document.getElementById("experience");
  setInterval(() => timer(experienceStartDate, experienceNode), 1000);
};
