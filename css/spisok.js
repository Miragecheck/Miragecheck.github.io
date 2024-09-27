const hamburger = document.querySelector('.hamburger')
const ulMobLinks = document.querySelector('.mob-links')

hamburger.addEventListener('click', ()=> {  ulMobLinks.classList.toggle('active');
})