const express = require('express');
const cors = require('cors');
const UserRouter = require('./router/userRouter');

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());
app.use('/user', UserRouter);
app.use('/ai', require('./router/AIRouter'));
app.use('/file', require('./router/fileRouter'));
app.use('/uploads', express.static('uploads'));
app.use('/admin', require('./router/adminRouter'));


const AIRouter = require('./router/AIRouter');
app.use('/', AIRouter);

app.get('/', (req, res) => {
  res.send('response from express');
});


//adding a new route
app.get('/add', (req, res) => {
  res.send('response from add route');
});

app.listen(port, () => {
  console.log(`Server started ${port}`);
});
