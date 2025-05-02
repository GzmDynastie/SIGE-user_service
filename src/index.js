import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerDocs from './docs/swagger.config.js';
import userRoutes from './routes/user.routes.js';
import userAuthRoutes from './routes/user.auth.routes.js';

const app = express();
const PORT = 5000;

app.use('/api/docs/user', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, '*');
        return callback(null, origin);
    },
    credentials: true
}));

app.use("/api/users", userRoutes);
app.use("/api/auth", userAuthRoutes);

app.listen(PORT, () => {
    console.log(`Server iniciado en http://localhost:${PORT}`);
});