// PK Grow - Blogs page functionality

import { db } from './firebase-config.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
  fetchBlogs();
});

/**
 * Fetch blogs from Firebase Firestore
 */
async function fetchBlogs() {
  try {
    console.log('Fetching blogs from Firebase...');
    
    // Reference to the blogs collection, ordered by date (newest first)
    const blogsCollection = collection(db, 'blogs');
    const blogsQuery = query(blogsCollection, orderBy('date', 'desc'));
    
    // Get documents from the collection
    const blogsSnapshot = await getDocs(blogsQuery);
    
    // Extract data from documents
    const blogsList = blogsSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Convert Firestore timestamp to Date object if it exists
      const date = data.date ? data.date.toDate() : new Date();
      
      return {
        id: doc.id,
        ...data,
        date: date
      };
    });
    
    // Populate the blogs in the UI
    populateBlogs(blogsList);
    
  } catch (error) {
    console.error('Error fetching blogs:', error);
    displayErrorMessage('Failed to load blogs. Please try again later.');
  }
}

/**
 * Populate blogs in the UI
 * @param {Array} blogs - Array of blog objects
 */
function populateBlogs(blogs) {
  const blogsContainer = document.getElementById('blogs-container');
  
  if (!blogsContainer) {
    console.error('Blogs container element not found');
    return;
  }
  
  // Clear loading state
  blogsContainer.innerHTML = '';
  
  if (blogs.length === 0) {
    blogsContainer.innerHTML = '<p class="no-results">No blogs available at the moment.</p>';
    return;
  }
  
  // Create HTML for each blog
  blogs.forEach(blog => {
    const blogElement = createBlogElement(blog);
    blogsContainer.appendChild(blogElement);
  });
}

/**
 * Create HTML element for a blog
 * @param {Object} blog - Blog object
 * @returns {HTMLElement} Blog element
 */
function createBlogElement(blog) {
  const blogDiv = document.createElement('article');
  blogDiv.className = 'blog-card';
  
  // Use placeholder image if no image is provided
  const imageUrl = blog.imageUrl || '../images/placeholder-thumbnail.jpg';
  const excerpt = blog.excerpt || (blog.content ? blog.content.substring(0, 150) + '...' : 'No excerpt available.');
  
  // Format the date
  const formattedDate = formatDate(blog.date);
  
  blogDiv.innerHTML = `
    <img src="${imageUrl}" alt="${blog.title}" class="blog-image">
    <div class="blog-content">
      <h3 class="blog-title">${blog.title}</h3>
      <p class="blog-date">${formattedDate}</p>
      <p class="blog-excerpt">${excerpt}</p>
      <a href="blog-detail.html?id=${blog.id}" class="btn">Read More</a>
    </div>
  `;
  
  return blogDiv;
}

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Display error message to the user
 * @param {string} message - Error message to display
 */
function displayErrorMessage(message) {
  const blogsContainer = document.getElementById('blogs-container');
  
  if (blogsContainer) {
    blogsContainer.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
        <button onclick="fetchBlogs()" class="btn">Try Again</button>
      </div>
    `;
  }
}