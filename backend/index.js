const express = require('express');
const cors    = require('cors');
const UserRouter = require('./router/userRouter');

// Connect to database
require('./connection');

const app  = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use('/user',    UserRouter);
app.use('/ai',      require('./router/AIRouter'));
app.use('/file',    require('./router/fileRouter'));
app.use('/admin',   require('./router/adminRouter'));
app.use('/uploads', express.static('uploads'));

// Convenience: also expose AI routes at root so /chat/query, /suggest-charts etc.
// work without the /ai prefix (existing frontend URLs stay compatible)
app.use('/',        require('./router/AIRouter'));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(port, () => {
  console.log(`ExcelIQ backend running on port ${port}`);
});
