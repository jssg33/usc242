// Inject CSS variables into :root
theme.spacing(2); // `${4 * 2}px` = '8px'

    // Make sure elements exist
    const slidesContainer = document.querySelector('.slides');
    const slideItems = document.querySelectorAll('.slide');
    const iframe = document.getElementById('centercourt');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    if (slidesContainer && slideItems.length && iframe && prevBtn && nextBtn) {
      let index = 0;
      let currentLink = slideItems[0].dataset.link;

      // Load first image into iframe
      iframe.src = slideItems[0].dataset.url;
	  iframe.setAttribute("width", "100%");
	  iframe.setAttribute("height", "100%");


      // Clicking the iframe goes to the website for the current slide
      iframe.addEventListener('click', () => {
        window.location.href = currentLink; // or window.open(currentLink, '_blank');
      });

      function showSlide(i) {
  index = i;
  const slide = slideItems[index];

  iframe.src = slide.dataset.url;
  currentLink = slide.dataset.link;

  slidesContainer.style.transform = `translateX(-${index * 190}px)`; // match min-width + gap

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
