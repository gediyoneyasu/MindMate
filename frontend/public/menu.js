// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
});
