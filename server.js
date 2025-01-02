process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0;
const express = require('express');
const path = require('path');
const { OpenAI_API } = require('./openai');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');


const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 solicitudes por ventana de tiempo por IP
    message: 'Demasiadas solicitudes desde esta IP, inténtelo de nuevo en 15 minutos',
    standardHeaders: true, // Retorna encabezados `RateLimit-*` en la respuesta
    legacyHeaders: false, // Deshabilita los encabezados `X-RateLimit-*`
  });

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(limiter);
app.use(helmet());

// Usa cookie-parser ANTES de csurf
app.use(cookieParser());
// Configura csurf
const csrfProtection = csurf({ cookie: true }); //Configura la cookie para que sea httpOnly
// Middleware para pasar el token CSRF a las vistas
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/getChatbotResponse', async (req, res) => {
    const userMessage = req.body.userMessage;
    saludar();
    
    // Use OpenAI API to generate a response
    const chatbotResponse = await  OpenAI_API.generateResponseSDK(userMessage)//OpenAIAPI.generateResponse(userMessage);
    
    // Send the response back to the client
    res.json({ chatbotResponse });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});