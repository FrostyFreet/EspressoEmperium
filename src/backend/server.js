import express from 'express'
import bodyParser from 'body-parser'
import {connectToDatabase,client} from './database.js'
import cors from 'cors'
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())

connectToDatabase();
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/fetchCoffeeMachines',async (req,res)=>{
    const data = await client.query(`
    SELECT 
        coffee_machines.*, 
        array_agg(images.path) AS image_paths
    FROM 
        coffee_machines
    JOIN 
        images ON coffee_machines.id = images.coffee_machine_id
    GROUP BY 
        coffee_machines.id;
`);
    try {
        res.json(data.rows)
    }
    catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/fetchPopularCoffeeMachines',async (req,res)=>{
    const data = await client.query(`
    SELECT 
        coffee_machines.*, 
        array_agg(images.path) AS image_paths
    FROM 
        coffee_machines 
    JOIN 
        images ON coffee_machines.id = images.coffee_machine_id
    GROUP BY 
        coffee_machines.id LIMIT 3;
`);
    try {
        res.json(data.rows)
    }
    catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).send('Internal Server Error');
    }
})
app.get('/fetchCoffeeMachines/:id',async (req,res)=>{
    const id=req.params.id
    const data = await client.query(`
        SELECT
            coffee_machines.*,
            array_agg(images.path) AS image_paths
        FROM
            coffee_machines
                JOIN
            images ON coffee_machines.id = images.coffee_machine_id
        WHERE
            coffee_machines.id = ${id}
        GROUP BY
            coffee_machines.id;
    `);
    try {
        res.json(data.rows)
    }
    catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/fetchDiscounts',async (req,res)=>{
    const data = await client.query(`
    SELECT 
        coffee_machines.*, 
        array_agg(images.path) AS image_paths
    FROM 
        coffee_machines
    
    JOIN 
        images ON coffee_machines.id = images.coffee_machine_id
    WHERE coffee_machines.discounted=true
    GROUP BY 
        coffee_machines.id;
`);
    try {
        res.json(data.rows)
    }
    catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/fetchCoffeeBeans',async (req,res)=>{
    const data = await client.query(`
    SELECT 
        coffee_machines.*, 
        array_agg(images.path) AS image_paths
    FROM 
        coffee_machines
    JOIN 
        images ON coffee_machines.id = images.coffee_machine_id
    GROUP BY 
        coffee_machines.id;
`);
    try {
        res.json(data.rows)
    }
    catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})