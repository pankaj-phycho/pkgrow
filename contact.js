// PK Grow - Contact form functionality

import { db } from './firebase-config.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Validate form
  if (!validateForm(name, email, message)) {
    return;
  }
  
  // Show loading state
  setFormState('loading');
  
  try {
    // Save to Firebase
    await saveContactForm({ name, email, message, timestamp: new Date() });
    
    // Show success message
    setFormState('success');
    
    // Reset form
    e.target.reset();
    
  } catch (error) {
    console.error('Error submitting form:', error);
    setFormState('error', 'Failed to send message. Please try again later.');
  }
}

/**
 * Validate form data
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} message - User's message
 * @returns {boolean} True if valid, false otherwise
 */
function validateForm(name, email, message) {
  // Clear previous errors
  clearErrors();
  
  let isValid = true;
  
  // Validate name
  if (!name || name.trim().length < 2) {
    showError('name', 'Please enter your name');
    isValid = false;
  }
  
  // Validate email
  if (!email || !isValidEmail(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate message
  if (!message || message.trim().length < 10) {
    showError('message', 'Please enter a message with at least 10 characters');
    isValid = false;
  }
  
  return isValid;
}

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show error message for a field
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message
 */
function showError(fieldName, message) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  const errorElement = document.createElement('p');
  errorElement.className = 'error-text';
  errorElement.textContent = message;
  errorElement.style.color = '#FF5252';
  errorElement.style.marginTop = '0.5rem';
  errorElement.style.fontSize = '0.9rem';
  
  field.parentNode.appendChild(errorElement);
  field.style.borderColor = '#FF5252';
}

/**
 * Clear all error messages
 */
function clearErrors() {
  // Remove error messages
  const errorElements = document.querySelectorAll('.error-text');
  errorElements.forEach(element => element.remove());
  
  // Reset border colors
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  formInputs.forEach(input => {
    input.style.borderColor = '#44445A';
  });
}

/**
 * Set form state (loading, success, error)
 * @param {string} state - Form state
 * @param {string} message - Optional message for error state
 */
function setFormState(state, message = '') {
  const submitButton = document.querySelector('#contact-form button[type="submit"]');
  const statusElement = document.getElementById('form-status');
  
  if (!statusElement) return;
  
  // Reset all states
  statusElement.className = 'form-status';
  statusElement.innerHTML = '';
  submitButton.disabled = false;
  submitButton.textContent = 'Send Message';
  
  switch (state) {
    case 'loading':
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      break;
      
    case 'success':
      statusElement.className = 'form-status success';
      statusElement.innerHTML = `
        <p>Thank you for your message! We'll get back to you soon.</p>
      `;
      break;
      
    case 'error':
      statusElement.className = 'form-status error';
      statusElement.innerHTML = `
        <p>${message}</p>
      `;
      break;
  }
}

/**
 * Save contact form data to Firebase
 * @param {Object} data - Form data to save
 */
async function saveContactForm(data) {
  // Reference to the contacts collection
  const contactsCollection = collection(db, 'contacts');
  
  // Add a new document
  await addDoc(contactsCollection, data);
}