import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import contactRouter from "./routes/contactRoute.js";
import rateRouter from "./routes/rateRoute.js";
import http from "http";
import { Server } from "socket.io";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);
app.use("/api/rate",rateRouter ) ;

app.get("/", (req, res) => {
  res.send("API Working");
});

// ✅ create HTTP server
const server = http.createServer(app);

// ✅ setup socket.io
const io = new Server(server, {
  cors: {
    origin:"*",   // frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// export io to use in routes
export { io };

// start server
server.listen(port, () => {
  console.log("MongoDB connected ");
  console.log(`Server Started on port: ${port}`);
});
