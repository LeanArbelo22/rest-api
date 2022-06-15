/* ------------------- modulos necesarios */
require('dotenv').config();
const express = require('express');
const hbs = require('express-handlebars');
const cors = require('cors');
/* ------------------- conexion y rutas */
const dbConnection = require('./config/configDB');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
/* ------------------- middlewares */
const logger = require('./middlewares/loggerMiddleware');
const handleErrors = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFoundMiddleware');
/* ------------------- */

dbConnection();
const app = express();
//app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // body parser middleware
app.use(cors()); // compartir recursos entre diferentes origenes
app.engine('.hbs', hbs.engine({
    defaultLayout: 'default',
    extname: '.hbs'
})); // configuracion de motor de vistas
app.set('view engine', '.hbs');

/* ------------- routes */
app.use(logger);

app.get('/', (req, res) => { // "HOME"
    res.status(200).json({ message: 'Ir a /api/products' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);

app.use(handleErrors);
/* ------------- */

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Aplicacion corriendo en el puerto ${PORT}`);
});

module.exports = { app, server };