/* =========================================================
   CHANGEWORKS TECHNOLOGIES — SITE SCRIPT
   1. Smooth scrolling for in-page nav links (with fixed-navbar offset)
   2. Navbar background state on scroll
   3. Client-side validation for the enquiry form
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     1. SMOOTH SCROLLING FOR NAV LINKS
     Targets any in-page anchor link (href="#section") and scrolls
     to it smoothly, offsetting for the fixed navbar height so the
     section title isn't hidden underneath it.
     --------------------------------------------------------- */
  var navbar = document.getElementById('mainNav');
  var navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');

      // Ignore empty "#" links
      if (!targetId || targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();

      var navbarHeight = navbar ? navbar.offsetHeight : 0;
      var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close the mobile menu after clicking a link, if it's open
      var collapseEl = document.getElementById('cwNavContent');
      if (collapseEl && collapseEl.classList.contains('show')) {
        var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);
        bsCollapse.hide();
      }
    });
  });

  /* ---------------------------------------------------------
     2. NAVBAR BACKGROUND ON SCROLL
     Adds a class once the user scrolls past the hero so the
     navbar reads clearly against light section backgrounds too.
     --------------------------------------------------------- */
  function updateNavbarState() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('cw-navbar-scrolled');
    } else {
      navbar.classList.remove('cw-navbar-scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbarState);
  updateNavbarState(); // run once on load

  /* ---------------------------------------------------------
     3. ENQUIRY FORM VALIDATION
     Uses Bootstrap's `was-validated` pattern: on submit, if any
     required field is invalid, the browser's built-in validity
     state is used to show Bootstrap's styled feedback messages
     and the form is NOT submitted. Swap the "success" block for
     a real fetch()/AJAX call to your backend or form service.
     --------------------------------------------------------- */
  var enquiryForm = document.getElementById('enquiryForm');
  var successAlert = document.getElementById('cwFormSuccess');

  if (enquiryForm) {
  const submitBtn = enquiryForm.querySelector('button[type="submit"]');

  enquiryForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopPropagation();

    // 1. Validate fields
    if (!enquiryForm.checkValidity()) {
      enquiryForm.classList.add('was-validated');
      const firstInvalid = enquiryForm.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      if (successAlert) successAlert.classList.add('d-none');
      return;
    }

    // 2. Prevent duplicate clicks
    if (submitBtn) submitBtn.disabled = true;
    if (successAlert) successAlert.classList.add('d-none');

    // 3. Post directly to formsubmit.co
    try {
      // Replace with your real receiving email address
      const response = await fetch('https://formsubmit.co/ajax/makeachange.3210@gmail.com', {
        method: 'POST',
        body: new FormData(enquiryForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Submission failed');

      if (successAlert) successAlert.classList.remove('d-none');
      enquiryForm.reset();
      enquiryForm.classList.remove('was-validated');
    } catch (err) {
      console.error(err);
      alert('Could not send message. Please try again.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

  /* ---------------------------------------------------------
     Footer year — keeps the copyright year current automatically
     --------------------------------------------------------- */
  var yearEl = document.getElementById('cwYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
