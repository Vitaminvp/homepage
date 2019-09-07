const kyivRelocationDate = new Date("1998-08-01");
const todaysDate = new Date();
const experienceStartDate = new Date("2017-01-01");
const experienceNode = document.getElementById("experience");

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
    document.querySelectorAll(".card__top").forEach(function(page) {
      page.style.backgroundColor = color;
    });
    document.querySelectorAll(".card__bottom").forEach(function(page) {
      page.style.backgroundColor = color;
    });
    document.querySelectorAll(".card__back").forEach(function(page) {
      page.style.setProperty("--dynamic-background", color);
    });
    document.querySelectorAll(".flip-clock__slot").forEach(function(page) {
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
const logo = document.getElementById("logo");
logo.addEventListener("mouseover", function() {
  this.querySelector("audio").play();
});
logo.addEventListener("mouseout", function() {
  this.querySelector("audio").pause();
});
document.querySelectorAll(".pig").forEach(page => {
  page.addEventListener("click", () => {
    page.querySelector("audio").play();
  });
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

function CountdownTracker(label, value) {
  const el = document.createElement("span");

  el.className = "flip-clock__piece";
  el.innerHTML = `<b class="flip-clock__card card"><span class="flip-clock__slot">${label}</span><b class="card__top"></b><b class="card__bottom"></b><b class="card__back"><b class="card__bottom"></b></b></b>`;

  this.el = el;

  const top = el.querySelector(".card__top"),
    bottom = el.querySelector(".card__bottom"),
    back = el.querySelector(".card__back"),
    backBottom = el.querySelector(".card__back .card__bottom");

  this.update = function(val) {
    val = ("0" + val).slice(-2);
    if (val !== this.currentValue) {
      if (this.currentValue >= 0) {
        back.setAttribute("data-value", this.currentValue);
        bottom.setAttribute("data-value", this.currentValue);
      }
      this.currentValue = val;
      top.innerText = this.currentValue;
      backBottom.setAttribute("data-value", this.currentValue);

      this.el.classList.remove("flip");
      void this.el.offsetWidth;
      this.el.classList.add("flip");
    }
  };

  this.update(value);
}

function getTimeRemaining(endTime) {
  const startDate = new Date(endTime.toISOString().substr(0, 10));
  const endDate = new Date();
  const t =
    Date.parse(endDate.toDateString()) - Date.parse(startDate.toDateString());

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
  const hours = endDate.getHours();
  const minutes = endDate.getMinutes();
  const seconds = endDate.getSeconds();

  return {
    Total: t,
    Years: yearDiff,
    Month: monthDiff,
    Days: dayDiff,
    Hours: hours,
    Minutes: minutes,
    Seconds: seconds
  };
}

function getTime() {
  const t = new Date();
  return {
    Total: t,
    Hours: t.getHours() % 12,
    Minutes: t.getMinutes(),
    Seconds: t.getSeconds()
  };
}

function Clock(countdown, callback) {
  countdown = countdown ? new Date(Date.parse(countdown)) : false;
  callback = callback || function() {};

  const updateFn = countdown ? getTimeRemaining : getTime;

  this.el = document.createElement("div");
  this.el.className = "flip-clock";

  let trackers = {},
    t = updateFn(countdown),
    key,
    timeinterval;

  for (key in t) {
    if (key === "Total") {
      continue;
    }
    trackers[key] = new CountdownTracker(key, t[key]);
    this.el.appendChild(trackers[key].el);
  }

  let i = 0;
  function updateClock() {
    timeinterval = requestAnimationFrame(updateClock);

    if (i++ % 10) {
      return;
    }

    const t = updateFn(countdown);
    if (t.Total < 0) {
      cancelAnimationFrame(timeinterval);
      for (key in trackers) {
        trackers[key].update(0);
      }
      callback();
      return;
    }
    for (key in trackers) {
      trackers[key].update(t[key]);
    }
  }
  setTimeout(updateClock, 1000);
}

const c = new Clock(experienceStartDate);
experienceNode.replaceWith(c.el);
