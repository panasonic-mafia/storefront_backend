import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import userRoutes from './handlers/usersRoutes'
import errorHandler from './middlewares/errorHadler'
import productsRoutes from './handlers/productsRoutes'
import ordersRoutes from './handlers/ordersRoutes'

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())
//use helmet
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

userRoutes(app)
productsRoutes(app)
ordersRoutes(app)

app.use(errorHandler)

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

export default app