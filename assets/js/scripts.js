const lvivRelocationDate = new Date("1998-08-01");
const todaysDate = new Date();
const monthsLivingInLviv = todaysDate.getMonth() - lvivRelocationDate.getMonth() + (12 * (todaysDate.getFullYear() - lvivRelocationDate.getFullYear()));
document.getElementById("kyiv-rent-months").innerHTML = "paid " + monthsLivingInLviv + " month" + (monthsLivingInLviv === 1 ? "" : "s") + " of rent already";
function switchToColor(color) {
    try {
        document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(function(page) {
            page.style.color = color;
        });
        document.querySelectorAll(".page").forEach(function(page) {
            page.style.borderColor = color;
        });
        document.querySelectorAll(".avatar").forEach(function(avatar) {
            avatar.contentDocument.getElementById("circle").setAttribute("fill", color);
        });
    } catch (error) {}
}
document.getElementById("midnightblue").addEventListener("click", switchToColor.bind(this, "midnightblue"));
document.getElementById("chartreuse").addEventListener("click", switchToColor.bind(this, "chartreuse"));
document.getElementById("tomato").addEventListener("click", switchToColor.bind(this, "tomato"));
document.getElementById("royalblue").addEventListener("click", switchToColor.bind(this, "royalblue"));
document.getElementById("deeppink").addEventListener("click", switchToColor.bind(this, "deeppink"));
document.getElementById("aqua").addEventListener("click", switchToColor.bind(this, "aqua"));
document.getElementById("red").addEventListener("click", switchToColor.bind(this, "red"));
document.getElementById("meh").addEventListener("click", function() {
    this.querySelector('audio').play();
});
function replaceNoscript(noscript) {
    const parent = noscript.parentElement;
    Array.prototype.slice.call((new DOMParser()).parseFromString(noscript.textContent, "text/html").body.children).forEach(function(element) {
        parent.insertBefore(element, noscript);
    });
    parent.removeChild(noscript);
}
function callFuncOnCollection(collection, func) {
    Array.prototype.slice.call(collection).map(function (item) {
        func(item);
    });
}
const childhoodPhotos = document.getElementById("childhood").getElementsByClassName("photos")[0];
document.getElementById("resume").addEventListener("click", function() {
    callFuncOnCollection(childhoodPhotos.getElementsByTagName("NOSCRIPT"), replaceNoscript);
});
if (window.location.hash === "#childhood") {
    callFuncOnCollection(childhoodPhotos.getElementsByTagName("NOSCRIPT"), replaceNoscript);
}
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register('/sw.js');
    });
}
