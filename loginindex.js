const fs = require('fs');
const path = require('path');
const  filePath= path.resolve(__dirname , 'user.json');

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());


//creates environment
//app is instance of express
app.listen(port, ()=>{
    console.log("listening..." ,port)
});

async function fetchDataUsingFs(){
    try{
        const data = await fs.readFileSync( filePath, 'utf8');
        //const propertyValues = Object.values(data);
        console.log(data);
        return data;
    }
    catch(error){
        console.error('errer fetching data :' ,error.message)
    }
}

fetchDataUsingFs();

app.post('/api/login', async (req, res) => {
    const userReq = req.body;
    if (!userReq.username || !userReq.password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const data = await fetchDataUsingFs();
        const userData = JSON.parse(data).users;

        const filteredUser = userData.find(user => user.username === userReq.username);

        if (!filteredUser) {
            return res.status(404).json({ error: 'User not found.' });
            
        }

        if (filteredUser.password !== userReq.password) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        return res.json(filteredUser);
    } catch (error) {
        console.error('Error occurred while processing login:', error.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

//localStorage.getitem
//localStorage.setitem 

