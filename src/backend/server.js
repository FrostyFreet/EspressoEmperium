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

app.get('/fetchAllData', async (req, res) => {
    try {
        const data = await client.query(`
        SELECT  
            coffee_machines.*,
            array_agg(images.path) AS image_paths
        FROM coffee_machines
        JOIN
             images ON coffee_machines.id = images.coffee_machine_id
        GROUP BY
            coffee_machines.id
        UNION ALL
        SELECT
            coffee_beans.*,
            array_agg(coffee_beans_images.path) AS image_paths
        FROM coffee_beans
        JOIN
            coffee_beans_images ON coffee_beans.id = coffee_beans_images.coffee_beans_id
        GROUP BY
            coffee_beans.id;
        `);
        res.json(data.rows);
    } catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).send('Internal Server Error');
    }
});



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
app.get('/fetchCoffeeMachines/:id/:name', async (req, res) => {
    const { id, name } = req.params;
    console.log(req.params)
    try {
        const data = await client.query(
            `
                SELECT
                    coffee_machines.id, coffee_machines.name, coffee_machines.price, coffee_machines.discountedprice,
                    coffee_machines.description, coffee_machines.stock,
                    array_agg(images.path) AS image_paths
                FROM coffee_machines
                         JOIN images ON coffee_machines.id = images.coffee_machine_id
                WHERE
                    coffee_machines.id = $1 AND coffee_machines.name ILIKE $2
                GROUP BY
                    coffee_machines.id

                UNION ALL

                SELECT
                    coffee_beans.id, coffee_beans.name, coffee_beans.price, coffee_beans.discountedprice,
                    coffee_beans.description, coffee_beans.stock,
                    array_agg(coffee_beans_images.path) AS image_paths
                FROM coffee_beans
                         JOIN coffee_beans_images ON coffee_beans.id = coffee_beans_images.coffee_beans_id
                WHERE
                    coffee_beans.id = $1 AND coffee_beans.name ILIKE $2
                GROUP BY
                    coffee_beans.id;`,
            [id, name]
        );

        if (data.rows.length === 0) {
            return res.status(404).send('Item not found');
        }

        // Send a uniform response format
        res.json(data.rows);
    } catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/fetchDiscounts', async (req, res) => {
    const data = await client.query(`
    SELECT 
        coffee_machines.*,
        array_agg(images.path) AS image_paths
    FROM 
        coffee_machines
    JOIN 
        images ON coffee_machines.id = images.coffee_machine_id
    WHERE 
        coffee_machines.discounted = true
    GROUP BY 
        coffee_machines.id

    UNION ALL
    SELECT 
        coffee_beans.*,
        array_agg(coffee_beans_images.path) AS image_paths
    FROM
        coffee_beans
    JOIN
        coffee_beans_images ON coffee_beans.id = coffee_beans_images.coffee_beans_id
    WHERE 
        coffee_beans.discounted = true
    GROUP BY
        coffee_beans.id;
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
        coffee_beans.*, 
        array_agg(coffee_beans_images.path) AS image_paths
    FROM 
        coffee_beans
    JOIN    
        coffee_beans_images ON coffee_beans.id = coffee_beans_images.coffee_beans_id
    GROUP BY 
        coffee_beans.id;
`);
    try {
        res.json(data.rows)
    }
    catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/sendOrder', async (req, res) => {
    const { cartItems, address, city, zipCode } = req.body;

    // Construct shipping address
    const shipping_addr = `${city} ${address} ${zipCode}`;

    try {
        // Calculate total price based on cart items
        const totalPrice = cartItems.reduce((acc, item) => {
            return acc + (item.discounted ? item.discountedprice * item.item_quantity : item.price * item.item_quantity);
        }, 0);

        // Insert order details into orders table
        const orders = await client.query(`
            INSERT INTO orders (shipping_address, total_price)
            VALUES ($1, $2) RETURNING id
        `, [shipping_addr, totalPrice]);

        const orderId = orders.rows[0].id; // Get the generated order ID

        // Prepare ordered items for insertion
        const orderedItemsPromises = cartItems.map(item => {
            const { item_id, item_name, item_quantity } = item; // Ensure these fields exist in your cartItems
            const itemTotalPrice = item.discounted ? item.discountedprice * item_quantity : item.price * item_quantity;

            return client.query(`
                INSERT INTO ordered_items (order_id, product_id, product_name, quantity, total_price)
                VALUES ($1, $2, $3, $4, $5)
            `, [orderId, item_id, item_name, item_quantity, itemTotalPrice]);
        });

        // Execute all insertions for ordered items
        await Promise.all(orderedItemsPromises);

        // Send success response with order ID
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})