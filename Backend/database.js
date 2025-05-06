import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { format, parse } from 'date-fns';
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306
});

//Account functions 

async function getAllAccount(){
    const [rows] = await pool.query("SELECT * FROM accounts")
    return rows;
}

async function getAccountInfoByEmail(email) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM accounts 
        WHERE email = ?`, [email]);
    return rows;
}

async function getAccountInfoByID(account_id) {
    const [rows] =await pool.query (`
        SELECT *
        FROM accounts
        WHERE account_id = ?`, [account_id]);
        return rows;
}

async function createAccount(fname, lname, email, password){
    const [existingAccount] = await pool.query(`SELECT * FROM accounts WHERE email = ?`, [email]);

    if (existingAccount.length > 0) {
        throw new Error('Email already in use');
    };

    await pool.query(`
        INSERT INTO accounts (fname, lname, email, password)
        VALUES(?,?,?,?)`, [fname,lname,email,password]
    );
}

async function deleteMedication(medication_id) {
    const [existingMedication] = await pool.query('SELECT * FROM medications WHERE medication_id = ?', [medication_id]);

    if (existingMedication.length === 0) {
        throw new Error('Medication not found');
    }

    const [result] = await pool.query('DELETE FROM medications WHERE medication_id = ?', [medication_id]);

    if (result.affectedRows === 0) {
        throw new Error('Failed to delete medication');
    }

    return result;
}

async function updateAccountPassword (account_id, newPassword) {
    try{
        const[result] = await pool.query(`
        UPDATE accounts
        SET password = ?
        WHERE account_id = ?`, [newPassword, account_id]);

    return result;
        
    } catch(err){
        throw err;
    }
};

// Medication functions

async function getAllMedications() {
    const [rows] = await pool.query("SELECT * FROM medications");
    return rows;
}

async function getMedicationInfoByID(medication_id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM medications
        WHERE medication_id = ?`, [medication_id]);
    return rows;
}

async function createMedication(account_id, name, start_date, times_per_day, dosage, dosage_unit, quantity, start_time, end_time) {
    try {
        start_time = start_time.length === 5 ? `${start_time}:00` : start_time;
        end_time = end_time.length === 5 ? `${end_time}:00` : end_time;

        await pool.query(`
            INSERT INTO medications (account_id, name, start_date, times_per_day, dosage, dosage_unit, quantity, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [account_id, name, start_date, times_per_day, dosage, dosage_unit, quantity, start_time, end_time]
        );
    } catch (err) {
        throw new Error('Error creating medication: ' + err.message);
    }
}

async function getMedicationsForToday(accountId) {
    const today = format(new Date(), 'yyyy-MM-dd');

    const [rows] = await pool.query(`
        SELECT * 
        FROM medications
        WHERE account_id = ? 
        AND start_date <= ?
        ORDER BY start_date`, [accountId, today]);
        console.log("Fetched medications:", rows);
    return rows;
}

function calculateReminderTimes(startTime, endTime, timesPerDay) {
    const start = parse(startTime, 'HH:mm:ss', new Date());
    const end = parse(endTime, 'HH:mm:ss', new Date());

    if (isNaN(start) || isNaN(end)) {
        throw new Error('Invalid time value');
    }

    const times = [];
    const totalMinutes = (end - start) / 60000;
    const interval = totalMinutes / (timesPerDay - 1);

    for (let i = 0; i < timesPerDay; i++) {
        const time = new Date(start.getTime() + i * interval * 60000);
        times.push(format(time, 'HH:mm'));
    }

    return times;
}

export { 
    getAllAccount, 
    getAccountInfoByID, 
    createAccount, 
    getAllMedications, 
    getMedicationInfoByID, 
    createMedication, 
    getAccountInfoByEmail,
    updateAccountPassword,
    getMedicationsForToday,
    calculateReminderTimes,
    deleteMedication
};