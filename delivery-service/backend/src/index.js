const app = require("./server");

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`[Server] Delivery Service running on port ${PORT}`);
});
