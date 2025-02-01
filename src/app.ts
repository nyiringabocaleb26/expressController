import "reflect-metadata"; // Required for routing-controllers
import { createExpressServer } from "routing-controllers";
import { UserController } from "./controllers/UserController";
import cors from 'cors'
const app = createExpressServer({
  controllers: [UserController] // Register your controllers here
});

app.use(cors({
  origin: "http://localhost:5173/", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
}));

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
