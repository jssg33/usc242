
  import { createTheme } from "https://cdn.jsdelivr.net/npm/@mui/material@latest/+esm";

  const theme = createTheme({
    spacing: 2
  });

  theme.spacing(2);

  const slidesContainer = document.querySelector('.slides');
  const slideItems = document.querySelectorAll('.slide');
  const iframe = document.getElementById('centercourt');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  if (slidesContainer && slideItems.length && iframe && prevBtn && nextBtn) {
    let index = 0;
    let currentLink = slideItems[0].dataset.link;

    iframe.src = slideItems[0].dataset.url;
    iframe.setAttribute("width", "90%");
    iframe.setAttribute("height", "90%");
    iframe.setAttribute("max-width", "990px");
    iframe.addEventListener('click', () => {
      window.location.href = currentLink;
    });

    function showSlide(i) {
      index = i;
      const slide = slideItems[index];

      iframe.src = slide.dataset.url;
      currentLink = slide.dataset.link;

      slidesContainer.style.transform = `translateX(-${index * 190}px)`;

      slideItems.forEach(s => s.classList.remove('active'));
      slide.classList.add('active');
    }

    nextBtn.onclick = () => {
      showSlide((index + 1) % slideItems.length);
    };

    prevBtn.onclick = () => {
      showSlide((index - 1 + slideItems.length) % slideItems.length);
    };

    slideItems.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        showSlide(i);
      });
    });

  } else {
    console.warn('Slider elements not found – check HTML structure and class names.');
  }


