const express = require('express');
const UserRouter = require('./router/userRouter');

const app = express();
const port = 5000;
app.use(express.json());
app.use('/user', UserRouter);


app.listen(port, () => {
  console.log(`Server started ${port}`);
});