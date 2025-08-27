// Immediate DOM manipulation test
console.log("Script loading...");

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded");
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    console.log("Root found, setting content");
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial; background: #f0f0f0; min-height: 100vh;">
        <h1 style="color: #0066cc; font-size: 2rem;">Home Base - Direct DOM Test</h1>
        <p style="font-size: 1.2rem; margin: 20px 0;">If you see this, the DOM is working!</p>
        <button onclick="alert('Button works!')" style="background: #0066cc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Test Button</button>
      </div>
    `;
    console.log("Content set successfully");
  } else {
    console.error("Root element not found");
  }
});

// Also try immediate execution
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial; background: #e0e0e0;">
      <h1 style="color: #cc0000;">IMMEDIATE TEST - Home Base</h1>
      <p>This should show immediately if JavaScript is working</p>
    </div>
  `;
}
