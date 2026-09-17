document.addEventListener("DOMContentLoaded", function () {
  // 2.1 Seconds Vertical Split Loader Logic
  setTimeout(function () {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("loaded"); // Start vertical split
      setTimeout(function () {
        loader.style.display = "none"; // Hide completely after split ends
      }, 900); // Matches CSS transition duration
    }
  }, 2100); // 2100ms = 2.1 seconds

  // Select the hero element
  const hero = document.querySelector(".hero");

  // Select necessary elements for scrolling effects
  const header = document.getElementById("header");
  const progressBar = document.getElementById("scroll-progress");
  const parallaxImages = document.querySelectorAll(".parallax-img");
  const heroTitle = document.getElementById("hero-title");

  // Setup IntersectionObserver for reveal animations. Fallback if Lenis is blocked.
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px", threshold: 0.15 },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Setup Hero Text Split Animation
  if (heroTitle) {
    const textString = heroTitle.textContent;
    const splitText = textString.split("");
    heroTitle.textContent = "";
    for (let i = 0; i < splitText.length; i++) {
      const charSpan = document.createElement("span");
      charSpan.className = "char";
      charSpan.style.animationDelay = i * 0.28 + "s";
      charSpan.textContent = splitText[i] === " " ? "\u00A0" : splitText[i];
      heroTitle.appendChild(charSpan);
    }
  }

  // Wrapped in Try-Catch to ensure failure of one script doesn't break the whole page.
  try {
    // Initialize Smooth Scrolling (Lenis)
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle Smooth Scrolling to Anchors
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        lenis.scrollTo(this.getAttribute("href"));
      });
    });

    // Handle Scroll Effects
    lenis.on("scroll", (e) => {
      // Hero blackout logic
      if (e.scroll > 100) {
        // Threshold for starting blackout
        hero.classList.add("hero-blackout");
      } else {
        hero.classList.remove("hero-blackout");
      }

      // Header state logic
      if (e.scroll > 80) header.classList.add("scrolled");
      else header.classList.remove("scrolled");

      // Scroll Progress logic
      const scrollPercent =
        (e.scroll / (document.body.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = scrollPercent + "%";

      // Parallax Image logic
      parallaxImages.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          const speed = 0.15;
          const yPos = -(rect.top * speed);
          img.style.transform = `scale(1.1) translateY(${yPos}px)`;
        }
      });
    });
  } catch (error) {
    console.log(
      "Lenis Smooth Scroll failed to load (likely offline). Fallbacks applied.",
      error,
    );
  }
});
