import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-check.js";

const firebaseConfig = {
  apiKey: "AIzaSyC2p7a87pd-7dDhwGCEiupaOpA6XuA2ssQ",
  authDomain: "bhavik-digital-3e63e.firebaseapp.com",
  projectId: "bhavik-digital-3e63e",
  storageBucket: "bhavik-digital-3e63e.firebasestorage.app",
  messagingSenderId: "752119363044",
  appId: "1:752119363044:web:4988d5f67681d7618843f1",
  measurementId: "G-ZQNTX4K41S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EMAILJS_SERVICE_ID = "service_qxuq01g";
const EMAILJS_TEMPLATE_ID = "template_vdxmhml";
const EMAILJS_PUBLIC_KEY = "3SqAn3Eo2xHMw1FC0";

emailjs.init({
  publicKey: "3SqAn3Eo2xHMw1FC0",
});

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Lf9mCYtAAAAAPmTvycu-CBv9dsns0PrQj0h0Wkb"),
  isTokenAutoRefreshEnabled: true
});

document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader");
  const header = document.querySelector(".header");
  const mobileBtn = document.getElementById("mobileBtn");
  const navMenu = document.getElementById("navMenu");
  const contactForm = document.getElementById("contactForm");
  const navLinks = document.querySelectorAll(".nav-link");
  const revealItems = document.querySelectorAll(".reveal");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-card");
  const changingWord = document.getElementById("changingWord");

  setTimeout(() => {
    if (loader) loader.classList.add("hide");
  }, 900);

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => navMenu.classList.toggle("show"));
  }

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("show");
    });
  });

  const words = ["Flex Banners", "Acrylic Boards", "LED Sign Boards", "Vehicle Branding", "Shop Branding"];
  let wordIndex = 0;

  setInterval(() => {
    if (!changingWord) return;
    changingWord.style.opacity = "0";
    changingWord.style.transform = "translateY(18px)";

    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      changingWord.textContent = words[wordIndex];
      changingWord.style.opacity = "1";
      changingWord.style.transform = "translateY(0)";
    }, 250);
  }, 2200);

  if (changingWord) {
    changingWord.style.transition = "0.35s ease";
  }

  function revealOnScroll() {
    revealItems.forEach((item) => {
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop < window.innerHeight - 80) {
        item.classList.add("active");
      }
    });
  }

  function setActiveLink() {
    let current = "home";

    document.querySelectorAll("main section").forEach((section) => {
      if (window.scrollY >= section.offsetTop - 180) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  function headerShadow() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  function animateCounters() {
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter) => {
      if (counter.dataset.done === "true") return;

      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        counter.dataset.done = "true";

        const target = Number(counter.dataset.target);
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 70));

        const timer = setInterval(() => {
          current += increment;

          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = current;
          }
        }, 20);
      }
    });
  }

  window.addEventListener("scroll", () => {
    revealOnScroll();
    setActiveLink();
    headerShadow();
    animateCounters();
  });

  revealOnScroll();
  setActiveLink();
  headerShadow();
  animateCounters();

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      portfolioCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filterValue === "all" || category === filterValue) {
          card.style.display = "block";
          setTimeout(() => card.classList.add("active"), 20);
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y / rect.height - 0.5) * -10;
      const rotateY = (x / rect.width - 0.5) * 10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const website = document.getElementById("website")?.value || "";

      if (website) {
        return;
      }

      const lastSubmit = localStorage.getItem("lastSubmit");

      if (lastSubmit && Date.now() - Number(lastSubmit) < 60000) {
        alert("Please wait 1 minute before submitting again.");
        return;
      }

      const name = document.getElementById("name")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const phone = document.getElementById("phone")?.value.trim() || "";
      const service = document.getElementById("service")?.value || "";
      const message = document.getElementById("message")?.value.trim() || "";
      const submitButton = contactForm.querySelector("button");

      if (!name || !email || !message) {
        alert("Please fill required fields.");
        return;
      }

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        await addDoc(collection(db, "enquiries"), {
          name,
          email,
          phone,
          service,
          message,
          source: "website-contact-form",
          status: "new",
          createdAt: serverTimestamp()
        });

await emailjs.send(
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  {
    from_name: name,
    from_email: email,
    phone: phone,
    service: service,
    message: message,
    source: "Home Page Contact Form"
  }
);

        localStorage.setItem("lastSubmit", Date.now());

        alert("Enquiry submitted successfully!");
        contactForm.reset();
        
      } catch (error) {
  console.error("Form submit error:", error);

  alert(
    "Request failed: " +
    (error?.message || error?.text || JSON.stringify(error))
  );
}

 finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send Enquiry";
      }
    });
  }
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  if (!navigator.onLine) {
    loader.classList.add("offline");
    return;
  }

  setTimeout(() => {
    loader.classList.add("hide");
  }, 900);
});

window.addEventListener("offline", () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  loader.classList.remove("hide");
  loader.classList.add("offline");
});

window.addEventListener("online", () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  loader.classList.remove("offline");

  setTimeout(() => {
    loader.classList.add("hide");
  }, 800);
});



const themeToggle = document.getElementById("themeToggle");

function applySavedTheme(){
  const savedTheme = localStorage.getItem("siteTheme");

  if(savedTheme === "dark"){
    document.body.classList.add("dark-mode");
    if(themeToggle){
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  }else{
    document.body.classList.remove("dark-mode");
    if(themeToggle){
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }
}

applySavedTheme();

if(themeToggle){
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");

    localStorage.setItem("siteTheme", isDark ? "dark" : "light");

    themeToggle.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  });
}




const themeToggle = document.getElementById("themeToggle");

function applySavedTheme(){
  const savedTheme = localStorage.getItem("siteTheme");

  if(savedTheme === "dark"){
    document.body.classList.add("dark-mode");
    if(themeToggle) themeToggle.checked = true;
  }else{
    document.body.classList.remove("dark-mode");
    if(themeToggle) themeToggle.checked = false;
  }
}

applySavedTheme();

if(themeToggle){
  themeToggle.addEventListener("change", () => {
    const isDark = themeToggle.checked;

    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("siteTheme", isDark ? "dark" : "light");
  });
}

const circleMenuBtn = document.getElementById("circleMenuBtn");
const circleContactMenu = document.getElementById("circleContactMenu");

if(circleMenuBtn && circleContactMenu){
  circleMenuBtn.addEventListener("click", () => {
    circleContactMenu.classList.toggle("open");
    circleMenuBtn.textContent = circleContactMenu.classList.contains("open") ? "×" : "☰";
  });
}