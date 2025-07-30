const express = require('express')
const app = express();
const PORT =  process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');
const path = require('path');
const errorHandler = require("./utils/errorHandler")
const agentesRouter = require("./routes/agentesRoutes")
const casosRouter = require("./routes/casosRoutes")
app.use(express.json())

app.use(agentesRouter)
app.use('/casos',casosRouter)


app.use(errorHandler)
const swaggerDocs = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/v1/docs-swagger", (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.json'));
});

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
