import express from "express";
import Sentry from "@sentry/node";
Sentry.init({
  dsn: "https://bc1d1cc609a5cb6758480e3a40c12bd3@o4509728781565952.ingest.us.sentry.io/4509728787529728",
  tracesSampleRate: 1.0,
});
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import chatbotRoutes from "./routes/chatbotroutes.js";
import { loggingMiddleware } from "./middlewares/logging.js";
import { securityMiddleware } from "./middlewares/security.js";
dotenv.config({});

console.log("=== TEST LOG: Deploying latest code to Render ===");

const app = express();

app.use(Sentry.Handlers.requestHandler());


// Security middleware
app.use(securityMiddleware);

// Debug logging middleware to trace all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Logging middleware
app.use(loggingMiddleware);
app.use(Sentry.Handlers.errorHandler());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

app.get('/', async(req, res) => {
    try {

        await connectDB();
        res.send('Server is running and database connected successfully!');
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).send('Server is running, but failed to connect to the database.');
    }
});
// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/chatbot", chatbotRoutes);



app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
})
