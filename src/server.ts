import app from './app'; // This will now work if app is exported correctly

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
