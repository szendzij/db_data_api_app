const express = require('express');
const oracledb = require('oracledb');
require('dotenv').config();


const app = express();
const port = 3000;

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTION_STRING
};

app.get('/orderNo/:number', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT * FROM ss_ord_orders WHERE no = :orderNumber`,
            [req.params.number]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data from the database');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/customerProspect/:uniqueEmail', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `select * from ss_cust_crm_prospects where email = :emailAddress`,
            [req.params.uniqueEmail]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Customer prospect not found');
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data from the database');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
