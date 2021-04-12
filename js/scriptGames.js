// var slideIndex = 0;
// showSlides();

// function showSlides() {
//   var i;
//   var slides = document.getElementsByClassName("mySlides");
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   slideIndex++;
//   if (slideIndex > slides.length) { slideIndex = 1 }
//   slides[slideIndex - 1].style.display = "block";
//   setTimeout(showSlides, 4000); //  4 seconds
// }

/* Navigation */

function navSlide() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");

  burger.addEventListener("click", () => {
    //Toggle Nav
    nav.classList.toggle("nav-active");

    //Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ""
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
      }
    });
    //Burger Animation
    burger.classList.toggle("toggle");
  });

}

navSlide();

/* Read more button */

const parentContainer = document.querySelector('.read-more-container');

parentContainer.addEventListener('click', event => {

  const current = event.target;

  const isReadMoreBtn = current.className.includes('read-more-btn');

  if (!isReadMoreBtn) return;

  const currentText = event.target.parentNode.querySelector('.read-more-text');

  currentText.classList.toggle('read-more-text--show');

  current.textContent = current.textContent.includes('Read More') ? "Read Less..." : "Read More...";

})