// Function to fetch tools from Firebase
function loadTools() {
  const toolsContainer = document.getElementById('tools-container');
  
  // Show loading state
  toolsContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `;
  
  // Fetch tools from Firestore
  db.collection("tools").get()
    .then((querySnapshot) => {
      const tools = [];
      querySnapshot.forEach((doc) => {
        tools.push({ id: doc.id, ...doc.data() });
      });
      
      renderTools(tools);
    })
    .catch((error) => {
      console.error("Error fetching tools: ", error);
      toolsContainer.innerHTML = `
        <div class="error-message">
          <p>Failed to load tools. Please try again later.</p>
        </div>
      `;
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadTools);