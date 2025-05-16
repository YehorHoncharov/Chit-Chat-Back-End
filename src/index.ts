import express, { Express } from 'express';
import cors from 'cors'
import userRouter from './userApp/userRouter';
import postRouter from './postApp/postRouter';



const app: Express = express()
const PORT = 3000
const HOST = '192.168.1.104'

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));




app.use(cors())

app.use('/user', userRouter);

app.use('/posts', postRouter);


// app.use(cors({
//   origin: ["http://localhost:8081"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
// }));



app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
})