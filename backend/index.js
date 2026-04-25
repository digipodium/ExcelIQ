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

// ── Public Contact Form Submission (no auth required) ──
const ContactModel = require('./models/contactModel');
app.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    if (!firstName || !email || !message) {
      return res.status(400).json({ success: false, message: 'First name, email, and message are required.' });
    }
    await ContactModel.create({ firstName, lastName, email, message });
    res.status(200).json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit your message.' });
  }
});

app.listen(port, () => {
  console.log(`ExcelIQ backend running on port ${port}`);
});
