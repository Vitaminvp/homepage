(function() {
  "use strict";

  // Everything on this page is an independent embellishment: a counter, a few
  // sounds, the colour swatches, the photo galleries, the experience clock.
  // None of them needs any of the others. They used to run as one long script
  // in global scope, so a single missing element threw and took every feature
  // below it with it — silently, since the page still rendered.
  //
  // Each feature is now mounted on its own. One that cannot find what it needs
  // returns, because a résumé section may simply not be there; one that throws
  // says so and leaves the rest running.

  // --- how long since the move to Kyiv --------------------------------------

  function kyivCounter() {
    const node = document.getElementById("kyiv-rent-months");
    if (!node) {
      return;
    }

    const relocation = new Date(document.body.dataset.kyivRelocation);
    const today = new Date();
    const months =
      today.getMonth() -
      relocation.getMonth() +
      12 * (today.getFullYear() - relocation.getFullYear());

    node.innerHTML =
      months + " month" + (months === 1 ? "" : "s") + " a native of Kyiv";
  }

  // --- the theme ------------------------------------------------------------

  // The theme is one custom property; base.css decides what it colours.
  function setTheme(color) {
    document.documentElement.style.setProperty("--accent", color);

    // The avatar is the one thing a property cannot reach: it is an <object>,
    // a separate document, and inlining its SVG would add 191KB to the page.
    const avatar = document.querySelector(".avatar");
    const circle =
      avatar && avatar.contentDocument
        ? avatar.contentDocument.getElementById("circle")
        : null;
    if (circle) {
      circle.setAttribute("fill", color);
    }
  }

  // One listener for every swatch: the button says which colour it is.
  function swatches() {
    document.querySelectorAll("[data-color]").forEach(function(button) {
      button.addEventListener("click", function() {
        setTheme(button.dataset.color);
      });
    });
  }

  // --- sounds ---------------------------------------------------------------

  function mehSound() {
    const button = document.getElementById("meh");
    const audio = button && button.querySelector("audio");
    if (!audio) {
      return;
    }
    button.addEventListener("click", function() {
      audio.play();
    });
  }

  function logoSound() {
    const logo = document.getElementById("logo");
    const audio = logo && logo.querySelector("audio");
    if (!audio) {
      return;
    }
    // CSS can hide a thing but it cannot silence one, and the avatar is the
    // only flourish still on screen once the personal page is closed. Read the
    // toggle inside the handler rather than at mount, so it reflects the state
    // the reader is actually in.
    const toggle = document.getElementById("personal");
    logo.addEventListener("mouseover", function() {
      if (toggle && !toggle.checked) {
        return;
      }
      audio.play().catch(function() {
        audio.pause();
      });
    });
    logo.addEventListener("mouseout", function() {
      audio.pause();
    });
  }

  function pigSounds() {
    document.querySelectorAll(".pig").forEach(function(pig) {
      const audio = pig.querySelector("audio");
      if (!audio) {
        return;
      }
      pig.addEventListener("click", function() {
        audio.play();
        if (navigator.vibrate) {
          navigator.vibrate([
            500,
            250,
            500,
            250,
            500,
            250,
            500,
            250,
            500,
            250,
            500
          ]);
        }
      });
    });
  }

  // --- photo galleries ------------------------------------------------------

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

  // A lightbox is an <a href="#some-dialog"> pointing at a <dialog> whose
  // photos wait inside <noscript> until they are wanted. That relationship is
  // already written in the markup, so this reads it from there rather than
  // restating each dialog id, trigger id and hash. Adding a gallery is markup
  // only.
  function dialogFor(hash) {
    if (!hash || hash.length < 2) {
      return null;
    }
    const target = document.querySelector(hash);
    return target && target.tagName === "DIALOG" ? target : null;
  }

  function revealPhotos(dialog) {
    const photos = dialog.querySelector(".photos");
    if (!photos) {
      return;
    }
    Array.prototype.slice
      .call(photos.getElementsByTagName("NOSCRIPT"))
      .forEach(replaceNoscript);
  }

  function lightboxes() {
    document.querySelectorAll('a[href^="#"]').forEach(function(trigger) {
      const dialog = dialogFor(trigger.getAttribute("href"));
      if (dialog) {
        trigger.addEventListener("click", function() {
          revealPhotos(dialog);
        });
      }
    });

    // Landing on a gallery's hash opens it without a click, so fill it too.
    const opened = dialogFor(window.location.hash);
    if (opened) {
      revealPhotos(opened);
    }
  }

  // --- the experience clock -------------------------------------------------

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

  // The clock takes the place of the written-out years in the intro, which is
  // what shows when this script does not run.
  function experienceClock() {
    const node = document.getElementById("experience");
    if (!node) {
      return;
    }
    const clock = new Clock(new Date(document.body.dataset.experienceStart));
    // The clock sits beside the written phrase rather than replacing it: on
    // paper a row of flipping cards is not a number of years, so print shows
    // the words and hides the clock. With this script off, no class is added
    // and the words show everywhere.
    //
    // It is also a flourish, so it carries `personal`: the CV a stranger opens
    // reads the phrase as a sentence, and the clock appears with the rest of
    // the personal page. The stylesheet hides the phrase only when the clock is
    // actually showing.
    node.classList.add("experience-print");
    clock.el.classList.add("personal");
    node.after(clock.el);
  }

  // --- mount ----------------------------------------------------------------

  [
    ["Kyiv counter", kyivCounter],
    ["colour swatches", swatches],
    ["meh sound", mehSound],
    ["logo sound", logoSound],
    ["pig sounds", pigSounds],
    ["photo galleries", lightboxes],
    ["experience clock", experienceClock]
  ].forEach(function(feature) {
    try {
      feature[1]();
    } catch (error) {
      console.error("could not start the " + feature[0], error);
    }
  });
})();
