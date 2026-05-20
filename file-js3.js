// =============================================
// PARTICLES.JS — BUBBLE EFFECT
// =============================================
particlesJS("particles-js", {
  particles: {
    number: { value: 40 },
    color: { value: "#7a334a" },
    shape: { type: "circle" },
    opacity: { value: 0.2, random: true },
    size: { value: 6, random: true },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 1.5,
      direction: "top",
      random: true,
      straight: false,
      out_mode: "out",
    },
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "bubble" },
    },
    modes: {
      bubble: { distance: 80, size: 10, opacity: 0.5 },
    },
  },
});

// =============================================
// FLOATING PHOTO ANIMATION
// =============================================
const photo = document.querySelector(".hero-photo");

if (photo) {
  let photoTime = 0;
  function floatPhoto() {
    photoTime += 0.007;
    const x = Math.sin(photoTime * 1.3) * 6;
    const y = Math.sin(photoTime) * 10;
    photo.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(floatPhoto);
  }
  floatPhoto();
}

// =============================================
// FADE-IN ON SCROLL
// =============================================
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".fade-in").forEach(function (el) {
  observer.observe(el);
});

// =============================================
// SKILLS BAR CHART (D3.js — first D3 project!)
// =============================================

// 1) THE DATA
// An array of objects. D3 binds each object to a DOM element.
// Edit these numbers freely — they're just integers 0–100.
const skillsData = [
  { name: "Tableau", level: 95 },
  { name: "Python", level: 90 },
  { name: "R", level: 85 },
  { name: "Pipelines", level: 85 },
  { name: "SQL", level: 70 },
  { name: "Google Big Query", level: 70 },
  { name: "React", level: 30 },
  { name: "D3.js", level: 25 },
];

// 2) GET THE CONTAINER and bail out if D3 didn't load
const skillsContainer = document.getElementById("skills-chart");

if (skillsContainer && typeof d3 !== "undefined") {
  // 3) DIMENSIONS — measured from the container so it scales with the layout
  const width = skillsContainer.clientWidth;
  const barAreaHeight = 180; // height available for bars (in pixels)
  const labelArea = 70; // space reserved BELOW the bars for rotated labels
  const topPad = 4;
  const height = topPad + barAreaHeight + labelArea;

  // Each skill gets a horizontal "slot" of equal width
  const numBars = skillsData.length;
  const slotWidth = width / numBars;
  const barWidth = slotWidth * 0.55; // bar is 55% of its slot; rest is gap

  // 4) CREATE THE SVG — D3 selects the div and appends an <svg> inside it
  const svg = d3
    .select("#skills-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // 5) THE SCALE
  // For a VERTICAL chart, the data value maps to bar HEIGHT (a Y dimension).
  // yScale(80) gives us "how many pixels tall is an 80% bar".
  const yScale = d3.scaleLinear().domain([0, 100]).range([0, barAreaHeight]);

  // helper: x position for the LEFT edge of each bar (centered in its slot)
  const barX = (d, i) => i * slotWidth + (slotWidth - barWidth) / 2;
  // the Y of the bottom of the chart area (bars grow upward from here)
  const barBottomY = topPad + barAreaHeight;

  // 6) BACKGROUND BARS — full-height gray "tracks" behind each bar
  svg
    .selectAll(".bar-bg")
    .data(skillsData)
    .enter()
    .append("rect")
    .attr("class", "bar-bg")
    .attr("x", barX)
    .attr("y", topPad)
    .attr("width", barWidth)
    .attr("height", barAreaHeight)
    .attr("rx", 3);

  // 7) FOREGROUND BARS — start at height 0, anchored to the bottom
  // We'll animate y UP and height UP simultaneously to make them grow from the bottom.
  const bars = svg
    .selectAll(".bar-fill")
    .data(skillsData)
    .enter()
    .append("rect")
    .attr("class", "bar-fill")
    .attr("x", barX)
    .attr("y", barBottomY) // start at the bottom
    .attr("width", barWidth)
    .attr("height", 0) // ...with no height
    .attr("rx", 3);

  // 8) LABELS — placed at the bottom-center of each bar, rotated -45°
  // Trick: wrap each label in a <g> that's translated to the right spot,
  // then rotate the inner text around (0,0) of that group.
  const labelGroups = svg
    .selectAll(".label-group")
    .data(skillsData)
    .enter()
    .append("g")
    .attr("class", "label-group")
    .attr(
      "transform",
      (d, i) =>
        `translate(${i * slotWidth + slotWidth / 2}, ${barBottomY + 12})`,
    );

  labelGroups
    .append("text")
    .attr("class", "skill-label")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")
    .text((d) => d.name);

  // 9) ANIMATE ON SCROLL — bars grow from the bottom upward
  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          bars
            .transition()
            .duration(900)
            .delay((d, i) => i * 80)
            .attr("y", (d) => barBottomY - yScale(d.level))
            .attr("height", (d) => yScale(d.level));
          chartObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  chartObserver.observe(skillsContainer);
}
