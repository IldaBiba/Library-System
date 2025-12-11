const express = require("express");
const bodyParser = require("body-parser");
const app = express(); 
app.use(express.json());
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = 3001;
const cors = require ("cors")

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(cors());

app.use("/users", userRoutes);
app.use("/books", bookRoutes)




app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});