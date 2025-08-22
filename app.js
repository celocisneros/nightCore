const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON (important if you want POST requests)
app.use(express.json());


// Serve everything in the "public" folder
app.use(express.static('public'));

// Example API route (optional)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});