// bmw.js
document.addEventListener("DOMContentLoaded", () => {
  // Helper Functions
  const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');

  const updateCartCount = () => {
    const cart = getCart();
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.length;
  };

  const updateLoginStatus = () => {
    const userMenu = document.getElementById('user-menu');
    if (!userMenu) return;
    const user = localStorage.getItem('user');
    if (user) {
      userMenu.innerHTML = `
        <a href="#" class="user-icon"><i class="fas fa-user"></i></a>
        <div class="dropdown-content user-dropdown">
          <span class="username">${user}</span>
          <a href="#" id="logout-link">Logout</a>
        </div>
      `;
      const logoutLink = document.getElementById('logout-link');
      if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('user');
          updateLoginStatus();
          window.location.reload();
        });
      }
    } else {
      userMenu.innerHTML = `
        <a href="#" class="user-icon"><i class="fas fa-user"></i></a>
        <div class="dropdown-content user-dropdown">
          <a href="#" id="login-link">Login</a>
          <a href="../userreg/signup.html" id="register-link">Register</a>
        </div>
      `;
      const loginLink = document.getElementById('login-link');
      if (loginLink) {
        loginLink.addEventListener('click', (e) => {
          e.preventDefault();
          document.getElementById('login-modal').style.display = 'block';
        });
      }
    }
  };

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Login Modal
  const loginModal = document.getElementById('login-modal');
  const loginClose = loginModal?.querySelector('.close');
  if (loginModal && loginClose) {
    loginClose.addEventListener('click', () => {
      loginModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    });
  }

  // Handle login-success Message
  window.addEventListener('message', (event) => {
    if (event.data === 'login-success') {
      loginModal.style.display = 'none';
      updateLoginStatus();
      window.location.reload();
    }
  });

  // Test Drive Modal
  const testDriveModal = document.getElementById('test-drive-modal');
  const testDriveBtn = document.getElementById('test-drive-btn');
  const testDriveClose = testDriveModal?.querySelector('.close');
  const testDriveForm = document.getElementById('test-drive-form');

  if (testDriveBtn && testDriveModal && testDriveClose && testDriveForm) {
    testDriveBtn.onclick = () => {
      testDriveModal.style.display = 'block';
    };

    testDriveClose.onclick = () => {
      testDriveModal.style.display = 'none';
    };

    window.addEventListener('click', (event) => {
      if (event.target === testDriveModal) {
        testDriveModal.style.display = 'none';
      }
    });

    testDriveForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const model = document.getElementById('model').value;
      if (name && email && model) {
        alert(`Thank you, ${name}! Your test drive request for ${model} has been submitted.`);
        testDriveModal.style.display = 'none';
        testDriveForm.reset();
      }
    };
  }

  // Contact Dealer Modal
  const contactDealerModal = document.getElementById('contact-dealer-modal');
  const contactDealerBtn = document.getElementById('contact-dealer-btn');
  const contactDealerClose = contactDealerModal?.querySelector('.close');
  const contactDealerForm = document.getElementById('contact-dealer-form');

  if (contactDealerBtn && contactDealerModal && contactDealerClose && contactDealerForm) {
    contactDealerBtn.onclick = () => {
      contactDealerModal.style.display = 'block';
    };

    contactDealerClose.onclick = () => {
      contactDealerModal.style.display = 'none';
    };

    window.addEventListener('click', (event) => {
      if (event.target === contactDealerModal) {
        contactDealerModal.style.display = 'none';
      }
    });

    contactDealerForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('dealer-name').value;
      const email = document.getElementById('dealer-email').value;
      const model = document.getElementById('dealer-model').value;
      if (name && email && model) {
        alert(`Thank you, ${name}! Your dealer inquiry for ${model} has been sent.`);
        contactDealerModal.style.display = 'none';
        contactDealerForm.reset();
      }
    };
  }

  // Profile Popup Modal
  const profilePopup = document.getElementById('profile-popup');
  const profileClose = profilePopup?.querySelector('.close');

  if (profilePopup && profileClose) {
    profilePopup.style.display = 'block';

    profileClose.addEventListener('click', () => {
      profilePopup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === profilePopup) {
        profilePopup.style.display = 'none';
      }
    });
  }

  // Configurator Image Swap
  const carPreview = document.getElementById('car-preview');
  const colorImages = {
    black: './assets/images/black.avif',
    blue: './assets/images/blue.avif',
    white: './assets/images/white.avif',
  };

  document.querySelectorAll('.color-btn').forEach(button => {
    button.addEventListener('click', () => {
      const color = button.getAttribute('data-color');
      carPreview.classList.add('fade');
      setTimeout(() => {
        carPreview.src = colorImages[color];
        carPreview.setAttribute('data-color', color);
        carPreview.classList.remove('fade');
      }, 500);
    });
  });

  updateLoginStatus();
  updateCartCount();
});