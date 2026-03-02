import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js"; 
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = YAML.load('./docs/swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("LumiRise API Running"));

const PORT = process.env.PORT;
const BACKEND_URL = process.env.BACKEND_URL;
connectDB().then(() => {
  app.listen(PORT, () => {const swaggerURL = `${BACKEND_URL}/api-docs`;
    console.log(`Server running on ${BACKEND_URL}`);
    console.log(`Open Swagger UI: %c${swaggerURL}`, 'color: blue; text-decoration: underline;');
 });
});
