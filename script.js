/* ==========================================
   AETHERIS INTERACTIVE HANDLERS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. PRODUCT FINISH SELECTOR ---
  const colorDots = document.querySelectorAll('.color-dot');
  const colorNameDisplay = document.getElementById('color-name-display');
  const formFinishSelect = document.getElementById('form-finish');
  const productGlow = document.getElementById('product-glow');
  const selectorRingImg = document.getElementById('selector-ring-img');

  const finishDetails = {
    titanium: {
      name: 'Titanium Silver',
      glow: 'radial-gradient(circle, rgba(0, 229, 255, 0.25) 0%, rgba(8, 7, 12, 0) 70%)',
      filter: 'none' // Default metallic look
    },
    stealth: {
      name: 'Stealth Black',
      glow: 'radial-gradient(circle, rgba(140, 82, 255, 0.2) 0%, rgba(8, 7, 12, 0) 70%)',
      filter: 'brightness(0.35) contrast(1.2)' // Simulated dark finish
    },
    aurora: {
      name: 'Aurora Gold',
      glow: 'radial-gradient(circle, rgba(255, 183, 3, 0.2) 0%, rgba(8, 7, 12, 0) 70%)',
      filter: 'sepia(0.6) hue-rotate(5deg) saturate(2.5) brightness(0.95)' // Simulated gold plating
    }
  };

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      // Toggle active states
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const finishKey = dot.getAttribute('data-color');
      const details = finishDetails[finishKey];

      if (details) {
        // Update configurator labels
        colorNameDisplay.textContent = details.name;
        
        // Update product images filters and glows
        productGlow.style.background = details.glow;
        selectorRingImg.style.filter = details.filter;

        // Synchronize with pre-order form
        formFinishSelect.value = finishKey;
      }
    });
  });

  // Sync back from form selector to configurator UI
  formFinishSelect.addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    const targetDot = document.getElementById(`color-${selectedValue}`);
    if (targetDot) targetDot.click();
  });


  // --- 2. SIZE SELECTION SYNC ---
  const sizeButtons = document.querySelectorAll('.size-btn');
  const formSizeSelect = document.getElementById('form-size');

  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const sizeVal = btn.textContent.trim();
      // Sync size value with form dropdown
      formSizeSelect.value = sizeVal;
    });
  });

  formSizeSelect.addEventListener('change', (e) => {
    const selectedSize = e.target.value;
    if (selectedSize !== 'sizing-kit') {
      const targetBtn = document.getElementById(`size-${selectedSize}`);
      if (targetBtn) {
        sizeButtons.forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
      }
    }
  });


  // --- 3. INTERACTIVE SIZE FINDER SLIDER ---
  const circumferenceSlider = document.getElementById('circumference-slider');
  const sliderValueText = document.getElementById('slider-value');
  const calculatedSizeDisplay = document.getElementById('calculated-size');

  // Standard US ring size circumference ranges (simplified)
  const sizingRanges = [
    { size: 6, min: 50.0, max: 53.0 },
    { size: 7, min: 53.1, max: 55.5 },
    { size: 8, min: 55.6, max: 58.1 },
    { size: 9, min: 58.2, max: 60.7 },
    { size: 10, min: 60.8, max: 63.2 },
    { size: 11, min: 63.3, max: 65.8 },
    { size: 12, min: 65.9, max: 68.3 },
    { size: 13, min: 68.4, max: 72.0 }
  ];

  function updateEstimatedSize(circValue) {
    sliderValueText.textContent = circValue;
    
    // Find matching size
    let matchedSize = 8; // default fallback
    for (const range of sizingRanges) {
      if (circValue >= range.min && circValue <= range.max) {
        matchedSize = range.size;
        break;
      }
    }

    calculatedSizeDisplay.textContent = matchedSize;

    // Trigger configurator size selection to match calculated size
    const sizeBtn = document.getElementById(`size-${matchedSize}`);
    if (sizeBtn) {
      sizeButtons.forEach(b => b.classList.remove('active'));
      sizeBtn.classList.add('active');
      formSizeSelect.value = matchedSize;
    }
  }

  circumferenceSlider.addEventListener('input', (e) => {
    updateEstimatedSize(parseFloat(e.target.value));
  });


  // --- 4. PRE-ORDER FORM SUBMISSION ---
  const preorderForm = document.getElementById('preorder-form');
  const formSuccessContainer = document.getElementById('form-success');
  const successEmailText = document.getElementById('success-email');

  preorderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const finish = formFinishSelect.options[formFinishSelect.selectedIndex].text;
    const size = formSizeSelect.value === 'sizing-kit' 
      ? 'Sizing Kit First' 
      : `Size ${formSizeSelect.value}`;

    // Display values in confirmation screen
    successEmailText.textContent = email;

    // Smooth transition: hide form, show success
    preorderForm.style.transition = 'opacity 0.3s ease';
    preorderForm.style.opacity = '0';
    
    setTimeout(() => {
      preorderForm.style.display = 'none';
      formSuccessContainer.style.display = 'flex';
    }, 300);
  });


  // --- 5. NEWSLETTER SIGNUP FEEDBACK ---
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    
    // Simple custom button notification response
    const submitBtn = document.getElementById('newsletter-submit');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#00e5ff\" stroke-width=\"2\"><polyline points=\"20 6 9 17 4 12\"/></svg>';
    emailInput.value = 'Subscribed!';
    emailInput.disabled = true;
    submitBtn.disabled = true;
  });

});
