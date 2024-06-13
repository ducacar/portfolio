// JavaScript code for expand buttons and modals
const expandButtons = document.querySelectorAll(".expand-button");
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal-close");

expandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-modal-id");
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    modal.style.display = "none";
  });
});

// JavaScript code for sticky navbar
const header = document.querySelector("header");

const first_skill = document.querySelector(".skill:first-child");
const sk_counters = document.querySelectorAll(".counter span");
const progress_bars = document.querySelectorAll(".skills svg circle");

const links = document.querySelectorAll(".nav-link");

const hamburger = document.querySelector(".hamburger");

window.addEventListener("scroll", () => {
  activeLink();
  if (!skillsPlayed) skillsCounter();
});

function stickyNavbar() {
  header.classList.toggle("scrolled", window.pageYOffset > 0);
}

stickyNavbar();

window.addEventListener("scroll", stickyNavbar);

// JavaScript code for animations
const sr = ScrollReveal({
  duration: 2500,
  distance: "60px",
});

sr.reveal(".showcase-info", { delay: 400 });
sr.reveal(".showcase-image", { origin: "top", delay: 500 });
sr.reveal(".website-grid", { origin: "left", delay: 400 });
sr.reveal(".contact-info", { origin: "left", delay: 400 });
sr.reveal(".contact-grid", { origin: "bottom", delay: 500 });

function hasReached(el) {
  let topPosition = el.getBoundingClientRect().top;
  if (window.innerHeight >= topPosition + el.offsetHeight) return true;
  return false;
}

function updateCount(num, maxNum) {
  let currentNum = +num.innerText;
  if (currentNum < maxNum) {
    num.innerText = currentNum + 1;
    setTimeout(() => {
      updateCount(num, maxNum);
    }, 12);
  }
}

let skillsPlayed = false;

function skillsCounter() {
  if (!hasReached(first_skill)) return;

  skillsPlayed = true;
  sk_counters.forEach((counter, i) => {
    let target = +counter.dataset.target;
    let strokeValue = 427 - 427 * (target / 100);

    progress_bars[i].style.setProperty("--target", strokeValue);

    setTimeout(() => {
      updateCount(counter, target);
    }, 400);
  });

  progress_bars.forEach(
    (p) => (p.style.animation = "progress 2s ease-in-out forwards")
  );
}

// JavaScript code for filtering cards
const navButtons = document.querySelectorAll(".nav-btn");
const cards = document.querySelectorAll(".card");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    cards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");

      if (filter === "all" || cardCategory === filter) {
        card.classList.add("slide-left");
        card.classList.remove("hide");
      } else {
        card.classList.remove("slide-left");
        card.classList.add("hide");
      }
    });
  });
});

/* Nav color change */

function activeLink() {
  let sections = document.querySelectorAll("section[id]");
  let passedSection = Array.from(sections)
    .map((sct, i) => {
      return {
        y: sct.getBoundingClientRect().top - header.offsetHeight,
        id: i,
      };
    })
    .filter((sct) => sct.y <= 0);

  let currSectionID = passedSection.at(-1).id;
  links.forEach((l) => l.classList.remove("active"));
  links[currSectionID].classList.add("active");
}

// Open and close nav menu

hamburger.addEventListener("click", () => {
  document.body.classList.toggle("open");
  document.body.classList.toggle("stopScrolling");
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("open");
    document.body.classList.remove("stopScrolling");
  });
});
