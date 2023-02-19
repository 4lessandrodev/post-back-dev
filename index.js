import Express from "express";
import MemoryCache from "memory-cache";
import cors from 'cors';
import helmet from "helmet";
import { blockDDoS } from "block-ddos";
const FIVE_MINUTES = 1000 * 60 * 5;
const app = Express();
const PORT = process.env.PORT ?? 3000;

app.use(Express.json());
app.use(cors({ origin: '*' }));
app.use(helmet());

app.get('/', (_, res) => {
    return res.status(200).json({ ok: true, time: new Date().toISOString() });
});

app.use(blockDDoS({ attempts: 2 }));

app.get('/info/ip', (req, res) => {
    const value = req?.headers['x-forwarded-for'] ?? req?.ip ?? req.socket?.remoteAddress;
    const ip = (value === '::1') ? '127.0.0.1' : value ?? '0.0.0.0';
    return res.status(200).json({ ip });
});

app.post('/:token', (req, res) => {
    const { token } = req['params'];
    try {
        const DB = [];
        const payload = req?.['body'] ?? { body: "empty" };
        const cacheDb = MemoryCache.get(token);
        const db = Array.isArray(cacheDb) ? cacheDb : DB;
        db.push({ payload: payload, createdAt: new Date().toISOString() });
        MemoryCache.put(token, db, FIVE_MINUTES);
        return res.status(200).json({ saved: true });
    } catch (error) {
        return res.status(400).json({ saved: false });
    }
});

app.get('/:token', (req, res) => {
    const { token } = req['params'];
    const data = MemoryCache.get(token);

    return res.json({ data });
});

app.on('online', () => console.log(`Running on port ${PORT}`));
app.listen(PORT);
app.emit('online');
