import express from "express";
import mysql from 'mysql'
import dotenv from 'dotenv'
import cors from 'cors'
import moment from 'moment'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'test'
})

app.get('/', (req, res) => {
  res.json({message: 'hi'})
})

app.get('/trains', (req, res) => {
  const query = `SELECT * FROM trains WHERE start_point = ? AND end_point = ? AND DATE(departure_time) = ?`;
  const { start_point, end_point, departure_date } = req.query
  const values = [start_point, end_point, departure_date]
  
  db.query(query, values, (err, data) => {
    if (err) {
      console.log(err)
      return res.json({message: 'error during db query'})
    }

    return res.json({message: 'success', data})
  })
})

app.get('/trains/weak', (req, res) => {
  const query = `SELECT * FROM trains WHERE start_point = ? AND end_point = ? AND DATE(departure_time) BETWEEN ? AND ?`;
  const { start_point, end_point, departure_date } = req.query
  const arrival_time = moment(departure_date).add(7, 'days').format('YYYY-MM-DD')
  const values = [start_point, end_point, departure_date, arrival_time]
  
  db.query(query, values, (err, data) => {
    if (err) {
      console.log(err)
      return res.json({message: 'error during db query'})
    }

    return res.json({message: 'success', data})
  })
})


app.listen(8080, () => {
  console.log('server started')
})