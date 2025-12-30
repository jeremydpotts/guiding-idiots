/**
 * Jacksonville State University Component Library
 * Interactive JavaScript Components
 */

const JSU = {
  /**
   * Modal Component
   */
  Modal: {
    open: function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    close: function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    init: function() {
      // Close modal on overlay click
      document.querySelectorAll('.jsu-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.close(modal.id);
          }
        });
      });

      // Close modal on close button click
      document.querySelectorAll('.jsu-modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = btn.closest('.jsu-modal');
          if (modal) {
            this.close(modal.id);
          }
        });
      });

      // Close modal on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.jsu-modal.active').forEach(modal => {
            this.close(modal.id);
          });
        }
      });
    }
  },

  /**
   * Alert Component
   */
  Alert: {
    create: function(message, type = 'info', duration = 5000) {
      const alert = document.createElement('div');
      alert.className = `jsu-alert jsu-alert-${type}`;
      alert.textContent = message;
      alert.style.position = 'fixed';
      alert.style.top = '20px';
      alert.style.right = '20px';
      alert.style.minWidth = '300px';
      alert.style.zIndex = '9999';
      alert.style.animation = 'jsuSlideIn 0.3s ease-out';

      document.body.appendChild(alert);

      if (duration > 0) {
        setTimeout(() => {
          alert.style.animation = 'jsuSlideOut 0.3s ease-out';
          setTimeout(() => alert.remove(), 300);
        }, duration);
      }

      return alert;
    },

    success: function(message, duration) {
      return this.create(message, 'success', duration);
    },

    error: function(message, duration) {
      return this.create(message, 'error', duration);
    },

    warning: function(message, duration) {
      return this.create(message, 'warning', duration);
    },

    info: function(message, duration) {
      return this.create(message, 'info', duration);
    }
  },

  /**
   * Form Validation
   */
  Form: {
    validate: function(formElement) {
      let isValid = true;
      const inputs = formElement.querySelectorAll('.jsu-form-input, .jsu-form-select, .jsu-form-textarea');

      inputs.forEach(input => {
        // Clear previous errors
        const errorElement = input.parentElement.querySelector('.jsu-form-error');
        if (errorElement) {
          errorElement.remove();
        }
        input.style.borderColor = '';

        // Check required fields
        if (input.hasAttribute('required') && !input.value.trim()) {
          this.showError(input, 'This field is required');
          isValid = false;
        }

        // Email validation
        if (input.type === 'email' && input.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            this.showError(input, 'Please enter a valid email address');
            isValid = false;
          }
        }

        // Min length validation
        if (input.hasAttribute('minlength') && input.value) {
          const minLength = parseInt(input.getAttribute('minlength'));
          if (input.value.length < minLength) {
            this.showError(input, `Minimum ${minLength} characters required`);
            isValid = false;
          }
        }
      });

      return isValid;
    },

    showError: function(input, message) {
      input.style.borderColor = 'var(--jsu-red)';
      const error = document.createElement('span');
      error.className = 'jsu-form-help jsu-form-error';
      error.textContent = message;
      input.parentElement.appendChild(error);
    },

    reset: function(formElement) {
      formElement.reset();
      formElement.querySelectorAll('.jsu-form-error').forEach(error => error.remove());
      formElement.querySelectorAll('.jsu-form-input, .jsu-form-select, .jsu-form-textarea')
        .forEach(input => input.style.borderColor = '');
    }
  },

  /**
   * Tabs Component
   */
  Tabs: {
    init: function() {
      document.querySelectorAll('[data-jsu-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = tab.getAttribute('data-jsu-tab');
          const tabGroup = tab.closest('[data-jsu-tabs]');

          // Remove active class from all tabs and panels in this group
          tabGroup.querySelectorAll('[data-jsu-tab]').forEach(t => {
            t.classList.remove('active');
          });

          document.querySelectorAll('[data-jsu-tab-panel]').forEach(panel => {
            panel.classList.remove('active');
            panel.style.display = 'none';
          });

          // Add active class to clicked tab and corresponding panel
          tab.classList.add('active');
          const targetPanel = document.querySelector(`[data-jsu-tab-panel="${targetId}"]`);
          if (targetPanel) {
            targetPanel.classList.add('active');
            targetPanel.style.display = 'block';
          }
        });
      });
    }
  },

  /**
   * Dropdown Component
   */
  Dropdown: {
    init: function() {
      document.querySelectorAll('[data-jsu-dropdown]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const dropdownId = trigger.getAttribute('data-jsu-dropdown');
          const dropdown = document.getElementById(dropdownId);

          if (dropdown) {
            const isActive = dropdown.classList.contains('active');

            // Close all dropdowns
            document.querySelectorAll('.jsu-dropdown').forEach(d => {
              d.classList.remove('active');
            });

            // Toggle current dropdown
            if (!isActive) {
              dropdown.classList.add('active');
            }
          }
        });
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', () => {
        document.querySelectorAll('.jsu-dropdown').forEach(d => {
          d.classList.remove('active');
        });
      });
    }
  },

  /**
   * Smooth Scroll
   */
  smoothScroll: function(target, duration = 800) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;

    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  },

  /**
   * Initialize all components
   */
  init: function() {
    this.Modal.init();
    this.Tabs.init();
    this.Dropdown.init();

    // Add smooth scroll to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
          e.preventDefault();
          JSU.smoothScroll(href);
        }
      });
    });

    console.log('JSU Component Library initialized');
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => JSU.init());
} else {
  JSU.init();
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes jsuSlideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes jsuSlideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes jsuFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .jsu-dropdown {
    position: absolute;
    background: white;
    border: 1px solid var(--jsu-gray-200);
    border-radius: var(--jsu-radius-md);
    box-shadow: var(--jsu-shadow-lg);
    padding: var(--jsu-spacing-sm);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all var(--jsu-transition-fast);
    z-index: 1000;
  }

  .jsu-dropdown.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
