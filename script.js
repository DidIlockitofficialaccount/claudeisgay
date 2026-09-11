/* claudeis.gay — status page behaviour.
   Three jobs: draw the 90-day uptime graph, tick the uptime clock,
   and tick the "last checked" stamp. No dependencies, no tracking. */

(function () {
  "use strict";

  var SPECTRUM = ["#E8425A", "#F08B35", "#F2C744", "#3DBE72", "#3D7FE0", "#9B5DE5"];
  var DAYS = 90;
  var MONITORING_SINCE = new Date("2025-06-28T00:00:00Z");

  /* ---- colour helpers ---- */

  function hexToRgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ];
  }

  /* Walk the six stops as one continuous ramp and pick the colour at t (0..1). */
  function sampleSpectrum(t) {
    var span = SPECTRUM.length - 1;
    var pos = Math.min(t, 0.99999) * span;
    var i = Math.floor(pos);
    var f = pos - i;
    var a = hexToRgb(SPECTRUM[i]);
    var b = hexToRgb(SPECTRUM[i + 1]);
    return (
      "rgb(" +
      Math.round(a[0] + (b[0] - a[0]) * f) + "," +
      Math.round(a[1] + (b[1] - a[1]) * f) + "," +
      Math.round(a[2] + (b[2] - a[2]) * f) + ")"
    );
  }

  /* ---- the uptime graph ---- */

  function formatDay(date) {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function drawBars() {
    var host = document.getElementById("bars");
    if (!host) return;

    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var today = new Date();
    var frag = document.createDocumentFragment();

    for (var i = 0; i < DAYS; i++) {
      var day = new Date(today);
      day.setDate(today.getDate() - (DAYS - 1 - i));

      var bar = document.createElement("div");
      bar.className = "bar";
      bar.style.background = sampleSpectrum(i / (DAYS - 1));
      bar.setAttribute(
        "data-tip",
        formatDay(day) + "\n100% gay · no incidents"
      );
      if (!reduced) bar.style.animationDelay = (i * 8) + "ms";
      frag.appendChild(bar);
    }

    host.textContent = "";
    host.appendChild(frag);
    attachTooltip(host);
  }

  /* One tooltip for all 90 bars, clamped so it never escapes the row. */
  function attachTooltip(host) {
    var tip = document.createElement("div");
    tip.className = "bar-tip";
    tip.setAttribute("aria-hidden", "true");
    host.appendChild(tip);

    function show(bar) {
      tip.textContent = bar.getAttribute("data-tip");
      tip.classList.add("on");

      var rowBox = host.getBoundingClientRect();
      var barBox = bar.getBoundingClientRect();
      var tipW = tip.offsetWidth;

      var centre = barBox.left - rowBox.left + barBox.width / 2;
      var x = centre - tipW / 2;
      var max = rowBox.width - tipW;

      tip.style.left = Math.max(0, Math.min(x, Math.max(max, 0))) + "px";
    }

    host.addEventListener("mouseover", function (e) {
      var bar = e.target.closest(".bar");
      if (bar) show(bar);
    });

    host.addEventListener("mouseleave", function () {
      tip.classList.remove("on");
    });
  }

  /* ---- the uptime clock ---- */

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function tickUptime() {
    var el = document.getElementById("uptime-clock");
    if (!el) return;

    var elapsed = Date.now() - MONITORING_SINCE.getTime();
    if (elapsed < 0) elapsed = 0;

    var totalSeconds = Math.floor(elapsed / 1000);
    var totalDays = Math.floor(totalSeconds / 86400);
    var years = Math.floor(totalDays / 365);
    var days = totalDays - years * 365;

    var rem = totalSeconds % 86400;
    var hours = Math.floor(rem / 3600);
    var minutes = Math.floor((rem % 3600) / 60);
    var seconds = rem % 60;

    var out = "";
    if (years > 0) out += years + "y ";
    out += days + "d " + pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);

    el.textContent = out;
  }

  /* ---- the "last checked" stamp ---- */

  function startCheckStamp() {
    var el = document.getElementById("last-checked");
    if (!el) return;

    var since = 0;

    setInterval(function () {
      since += 1;
      if (since >= 60) {
        since = 0;
        el.textContent = "just now";
        return;
      }
      el.textContent =
        since === 1 ? "1 second ago" : since + " seconds ago";
    }, 1000);
  }

  /* ---- go ---- */

  drawBars();
  tickUptime();
  setInterval(tickUptime, 1000);
  startCheckStamp();
})();
