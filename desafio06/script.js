const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registroLink = document.querySelector('.registro-link');
const botaoLogin = document.querySelector('.botaoLogin');
const iconErro = document.querySelector('.icon-erro');

registroLink.addEventListener('click', ()=> {
   wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
 });

 botaoLogin.addEventListener('click', ()=> {
    wrapper.classList.add('active-botaoLogin');
 });

 iconErro.addEventListener('click', ()=> {
    wrapper.classList.remove('active-botaoLogin');
 });