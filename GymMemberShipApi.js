const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());


let members = []; // list to store gym members
let slots = [5,5,0,0]; // 0 - mrng,1-noon,2-evng,3-night
// Register a new gym membership
app.post('/register', (req, res) => {
    const { name, email, startDate,slot } = req.body;
    if (members.some(member => member.email === email)) {
        return res.status(400).json({ message: 'Member already exists' });
    }
    const slotAvailable = false;
    const availableSlots = [];
        if(slots[slot]>0){
            slotAvailable = true;
            slots[slot]--;
        } else {
            if(slots[0]>0){
                availableSlots.push('Morning');
               // return res.status(400).json({ message: 'Morning slot available' });
            }
            if(slots[1]>0){
                availableSlots.push('Afternoon');
               // return res.status(400).json({ message: 'Afternoon slot available' });
            } if(slots[2]>0){
                availableSlots.push('Evening');
                // return res.status(400).json({ message: 'Evng slot available' });
            }if (slots[3]>0){
                availableSlots.push('Night');
               //  return res.status(400).json({ message: 'Night slot available' });
            }
            if(availableSlots.length > 0){
                return res.status(400).json({message:'These are the available slots:', availableSlots});
            }
            else {
                return res.status(400).json({ message: 'No slots available'});
            }
        }
    if(slotAvailable){
    const newMember = { name, email, startDate};
    members.push(newMember);
    res.status(201).json({ message: 'Membership registered successfully', member: newMember });
    }

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