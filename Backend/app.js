import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import{ 
    getAllAccount, 
    getAccountInfoByID, 
    createAccount, 
    getAllMedications, 
    getMedicationInfoByID, 
    createMedication,
    getAccountInfoByEmail
}from './database.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); // using this to help test the frontend/back end. Get rid of this later. Isnt good
app.use(express.json());

// getting started

app.get('/', (req, res) =>{
    res.send('Medication Reminder is a go');
});

app.get('/accounts', async (req,res) => {
    try{
        const accounts = await getAllAccount();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// get accounts by id
app.get('/accounts/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const account = await getAccountInfoByID(id);
        if (account.length > 0){
            res.json(account[0]);
        } else {
            res.status(404).json({error: 'Account not found'});
        }
    } catch (err){
        res.status(500).json({error: err.message});
    }
});

// create account

app.post('/accounts', async(req,res) => {
    const {fname, lname, email, password } = req.body;
    try{
        await createAccount (fname, lname, email, password);
        res.status(201).json({message: 'Account created'});
    } catch(err){
        res.status(500).json({ error: err.message});
    }
});

app.get('/medications', async (req, res) => {
    try{
        const medications = await getAllMedications();
        res.json(medications);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
});

//get medication by  id

app.get('/medications/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const medication = await getMedicationInfoByID(id);
        if (medication.length > 0){
            res.json(medication[0]);
        } else {
            res.status(404).json({ error: 'Medication not found'});
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.post('/medications', async (req, res) => {
    const{ account_id, name, start_date, frequency, frequency_unit, dosage, dosage_unit, quantity, importance} = req.body;
    try {
        await createMedication(account_id, name, start_date, frequency, frequency_unit, dosage, dosage_unit, quantity, importance);
        res.status(201).json({message: 'Medication created'});
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

// for login

app.post('/login', async (req,res) => {
    const {email, password} =req.body;
    try {
        const rows = await getAccountInfoByEmail(email); 
        const account = rows.length > 0 ? rows[0] : null;

        if (account && account.password === password){
            res.status(200).json({ message: 'Login Successful',});
        } else {
            res.status(400).json({ error: 'Invalid Credentials'});
        }
    } catch (err){
        res.status(500).json({error : 'Server error: ' + err.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});