const express = require('express');
const cors = require('cors');
const UserRouter = require('./router/userRouter');

const app = express();
app.use(cors());
const port = 5000;
app.use(express.json());
app.use('/user', UserRouter);

app.get('/', (req, res) => {
  res.send('response from express');
});

app.use('/user', UserRouter);
app.use('/ai', require('./router/AIRouter'));
//adding a new route
app.get('/add', (req, res) => {
  res.send('response from add route');
});

app.listen(port, () => {
  console.log(`Server started ${port}`);
});
