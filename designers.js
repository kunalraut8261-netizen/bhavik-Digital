import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

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

emailjs.init("3SqAn3Eo2xHMw1FC0");


document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal");
  const filterButtons = document.querySelectorAll(".filter-box button");
  const workCards = document.querySelectorAll(".work-card");

  const magneticBox = document.getElementById("magneticBox");
  const magneticCircle = document.getElementById("magneticCircle");
  const magneticWord = document.getElementById("magneticWord");

  function revealOnScroll(){
    revealItems.forEach(item=>{
      if(item.getBoundingClientRect().top < window.innerHeight - 80){
        item.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  filterButtons.forEach(button=>{
    button.addEventListener("click",()=>{
      const filter = button.dataset.filter;

      filterButtons.forEach(btn=>btn.classList.remove("active"));
      button.classList.add("active");

      workCards.forEach(card=>{
        const category = card.dataset.category;
        card.style.display = filter === "all" || filter === category ? "flex" : "none";
      });
    });
  });

  if (magneticBox && magneticCircle && magneticWord) {
    const words = ["BRANDING", "DESIGN", "PRINTING", "CREATIVE"];
    let wordIndex = 0;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHover = false;

    magneticBox.addEventListener("mouseenter", (e) => {
      const rect = magneticBox.getBoundingClientRect();

      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      currentX = mouseX;
      currentY = mouseY;

      isHover = true;
      magneticWord.textContent = words[wordIndex];
    });

    magneticBox.addEventListener("mousemove", (e) => {
      const rect = magneticBox.getBoundingClientRect();

      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    magneticBox.addEventListener("mouseleave", () => {
      isHover = false;
    });

    setInterval(() => {
      if (!isHover) return;

      wordIndex = (wordIndex + 1) % words.length;
      magneticWord.textContent = words[wordIndex];
    }, 900);

    function animateMagnetic() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      if (isHover) {
        magneticCircle.style.transform =
          `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      }

      requestAnimationFrame(animateMagnetic);
    }

    animateMagnetic();
  }

  const form = document.querySelector("#contact form, form");

  if (form) {
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();

      const name = form.querySelector('input[type="text"]')?.value.trim() || "";
      const phone = form.querySelector('input[type="tel"]')?.value.trim() || "";
      const requirement = form.querySelector("select")?.value || "";
      const message = form.querySelector("textarea")?.value.trim() || "";
      const submitButton = form.querySelector("button");

      if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
      }

      const lastSubmit = localStorage.getItem("designerLastSubmit");

      if (lastSubmit && Date.now() - Number(lastSubmit) < 60000) {
        alert("Please wait 1 minute before submitting again.");
        return;
      }

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        await addDoc(collection(db, "enquiries"), {
          name,
          phone,
          service: requirement,
          message,
          source: "designers-page-form",
          status: "new",
          createdAt: serverTimestamp()
        });

await emailjs.send(
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  {
    from_name: name,
    from_email: "Not Provided",
    phone: phone,
    service: requirement,
    message: message,
    source: "Designers Page Form"
  }
);

        localStorage.setItem("designerLastSubmit", Date.now());

        alert("Designer request submitted successfully!");
        form.reset();
      } catch (error) {
        console.error("Designer enquiry error:", error);
        alert("Request save झाली नाही. Firestore rules check कर.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send Request";
      }
    });
  }

  const dynamicGrid = document.getElementById("dynamicVideoGrid");

  if (dynamicGrid) {
    const cards = dynamicGrid.querySelectorAll(".dynamic-frame-card");

    cards.forEach((card) => {
      const video = card.querySelector("video");

      card.addEventListener("mouseenter", () => {
        const row = Number(card.dataset.row);
        const col = Number(card.dataset.col);

        dynamicGrid.style.gridTemplateColumns =
          col === 0 ? "6fr 3fr 3fr" :
          col === 1 ? "3fr 6fr 3fr" :
          "3fr 3fr 6fr";

        dynamicGrid.style.gridTemplateRows =
          row === 0 ? "6fr 3fr" : "3fr 6fr";

        video.play();
      });

      card.addEventListener("mouseleave", () => {
        dynamicGrid.style.gridTemplateColumns = "4fr 4fr 4fr";
        dynamicGrid.style.gridTemplateRows = "4fr 4fr";

        video.pause();
      });
    });
  }

  window.addEventListener("scroll", () => {
    const title = document.querySelector(".magnetic-wrap");

    if (!title) return;

    const move = window.scrollY * 0.08;
    title.style.transform = `translateY(${move}px)`;
  });
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




