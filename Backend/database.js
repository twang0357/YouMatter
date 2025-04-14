import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
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
    await pool.query(`
        INSERT INTO accounts (fname, lname, email, password)
        VALUES(?,?,?,?)`,
        [fname,lname,email,password]
    );
}

async function updateAccountPassword (account_id, newPassword) {
    try{
        const[result] = await pool.query(`
        UPDATE accounts
        SET password = ?
        WHERE account_id = ?`,
    [newPassword, account_id]);

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

async function createMedication(account_id, name, start_date, frequency, frequency_unit, dosage, dosage_unit, quantity, importance) {
    await pool.query(`
        INSERT INTO medications (account_id, name, start_date, frequency, frequency_unit, dosage, dosage_unit, quantity, importance)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [account_id, name, start_date, frequency, frequency_unit, dosage, dosage_unit, quantity, importance]
    );
}

export { 
    getAllAccount, 
    getAccountInfoByID, 
    createAccount, 
    getAllMedications, 
    getMedicationInfoByID, 
    createMedication, 
    getAccountInfoByEmail,
    updateAccountPassword
};