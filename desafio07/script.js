const nextBtn = document.querySelector('.botao-proximo');
const prevBtn = document.querySelector('.botao-anterior');
const slides = document.querySelectorAll('.slide');
const numDeSlides = slides.length;
let slideNumber = 0;

//BOTAO DE PASSAR

nextBtn.onclick = () => {
    slides.forEach((slide) => {
      slide.classList.remove('active');
    });

    slideNumber++;


    if (slideNumber > (numDeSlides - 1)) {
       slideNumber = 0; 
    }

    slides[slideNumber].classList.add('active');
}

//BOTAO DE VOLTAR

prevBtn.onclick = () => {
    slides.forEach((slide) => {
      slide.classList.remove('active');
    });

    slideNumber--;


    if (slideNumber < 0) {
       slideNumber = numDeSlides - 1; 
    }

    slides[slideNumber].classList.add('active');
}
