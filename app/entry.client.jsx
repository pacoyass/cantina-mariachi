import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

// Minimal test component
const TestApp = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-green-600">React App Loaded Successfully!</h1>
      <p className="mb-4">If you can see this, React is working!</p>
      <p className="mb-4">Current time: {new Date().toLocaleString()}</p>
      <button 
        onClick={() => alert('Button click works!')}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Button Click
      </button>
    </div>
  );
};

startTransition(() => {
  try {
    console.log('Starting React app...');
    
    hydrateRoot(
      document,
      <StrictMode>
        <TestApp />
      </StrictMode>
    );
    
    console.log('React app rendered successfully!');
  } catch (error) {
    console.error('Error rendering React app:', error);
    document.getElementById('root').innerHTML = `
      <div class="p-8">
        <h1 class="text-3xl font-bold mb-4 text-red-600">Error Loading React App</h1>
        <p class="mb-2">There was an error loading the React app:</p>
        <pre class="bg-gray-100 p-4 rounded">${error.message}</pre>
        <p class="mt-4">Check the browser console for more details.</p>
      </div>
    `;
  }
});
