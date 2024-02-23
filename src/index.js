import { port } from "./config"
import express from "express"
import indexRouter from './routes/index.routes'
import {create} from 'express-handlebars'
import path from 'path'
import './database'
import morgan from "morgan"
import bodyParser from 'body-parser';

const app = express();

app.set('views', path.join(__dirname + '/views'));

const exphbs = create({
  layoutsDir: path.join(app.get('views'), 'layouts'),
  extname: ".hbs",
  defaultLayout: 'main'
})

app.engine(".hbs", exphbs.engine);
app.set('view engine', '.hbs');

//middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json());

//routes
app.use(indexRouter); 

app.listen(port, () => console.log(`Example app listening on port ${port}!`))