import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

//Account functions 

async function getAllAccount(){
    const [rows] = await pool.query("SELECT * FROM Account")
    return rows;
}

async function getAccountInfoByID(account_id) {
    const [rows] =await pool.query (`
        SELECT *
        FROM Account
        WHERE account_id = ?`, [account_id]);
        return rows;
}

async function createAccount(fname, lname, email, password){
    await pool.query(`
        INSERT INTO Account (fname, lname, email, password)
        VALUES(?,?,?,?)`,
        [fname,lname,email,password]
    );
}

// Medication functions

async function getAllMedications() {
    const [rows] = await pool.query("SELECT * FROM medication");
    return rows;
}

async function getMedicationInfoByID(medication_id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM medication
        WHERE medication_id = ?`, [medication_id]);
    return rows;
}

async function createMedication(account_id, name, start_date, frequency, frequency_unit, dosage, dosage_unit, quantity, importance) {
    await pool.query(`
        INSERT INTO medication (account_id, name, start_date, frequency, frequency_unit, dosage, dosage_unit, quantity, importance)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [account_id, name, start_date, frequency, frequency_unit, dosage, dosage_unit, quantity, importance]
    );
}

export { getAllAccount, getAccountInfoByID, createAccount, getAllMedications, getMedicationInfoByID, createMedication };