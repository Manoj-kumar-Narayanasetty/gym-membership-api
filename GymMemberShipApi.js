const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());


let members = []; // list to store gym members

// Register a new gym membership
app.post('/register', (req, res) => {
    const { name, email, startDate } = req.body;
    if (members.some(member => member.email === email)) {
        return res.status(400).json({ message: 'Member already exists' });
    }
    
    const newMember = { name, email, startDate };
    members.push(newMember);
    res.status(200).json({ message: 'Membership registered successfully', member: newMember });
});

// View membership details
app.get('/membership', (req, res) => {
    const { email } = req.query;
    const member = members.find(m => m.email === email);
    
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json(member);
});

// View all active members
app.get('/members', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; //date in YYYY-MM-DD
    const activeMembers = members.filter(member => member.startDate <= today);
    res.status(200).json(activeMembers.map(({ name, email }) => ({ name, email })));
});

// Cancel membership
app.delete('/cancel', (req, res) => {
    const { email } = req.body;
    const index = members.findIndex(m => m.email === email);

    if (index === -1) return res.status(404).json({ message: 'Member not found' });
    
    members.splice(index, 1);
    res.status(200).json({ message: 'Membership canceled successfully' });
});

// Modify membership start date
app.put('/modify', (req, res) => {
    const { email, newStartDate } = req.body;
    const member = members.find(m => m.email === email);

    if (!member) return res.status(404).json({ message: 'Member not found' });
    
    member.startDate = newStartDate;
    res.status(200).json({ message: 'Membership start date modified successfully', member });
});

if (require.main === module) {
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
module.exports = app;