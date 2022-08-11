import Express from "express";
import BodyParser from "body-parser";
import MemoryCache from "memory-cache";
import cors from 'cors';
import helmet from "helmet";
const FIVE_MINUTES = 1000 * 60 * 5;
const app = Express();
const PORT = process.env.PORT;

app.use(BodyParser.json());
app.use(cors({ origin: '*' }));
app.use(helmet());

app.get('/', (_, res) => {
    return res.send('ok');
});

app.post('/:token', (req, res) => {
    const { token } = req['params'];
    try {
        MemoryCache.put(token, req.body, FIVE_MINUTES);
        return res.send('ok');
    } catch (error) {
        return res.send('fail');
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
