import './App.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from 'react';
import moment from 'moment'

function App() {
  const [date, setDate] = useState(null)
  const [show, setShow] = useState(false)
  const [start, setStart] = useState('Львів')
  const [end, setEnd] = useState('Київ')
  const [sevenDays, setSevenDays] = useState(false)
  const [trains, setTrains] = useState([])
  
  console.log(sevenDays)
  
  useEffect(() => {
    if (date) {
      request()
    }
  }, [start, end])
  
  const setDataHandler = (d) => {
    const date = moment(d);
    setDate(date.format("YYYY-MM-DD"))
  }

  const showHandler = (e) => {
    e.preventDefault()
    setShow(c => !c)
  }

  const request = async () => {
    if (sevenDays) {
      const req = await fetch(`http://localhost:8080/trains/weak?start_point=${start}&end_point=${end}&departure_date=${date}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then((d) => d.json())

      setTrains(req.data)
    } else {
      const req = await fetch(`http://localhost:8080/trains?start_point=${start}&end_point=${end}&departure_date=${date}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).then((d) => d.json())

      setTrains(req.data)
    }
  }

  const searchHandler = async (e) => {
    e.preventDefault()
    if (start === end) {
      alert('departure and arrival must be different')
      return
    }

    if (!date) {
      alert('please select date')
      return
    }

    await request()

    setShow(false)
  }

  return (
    <div className="App">
      <div className='trains'>
        <form className='form'>
          <div className='form_select-wraper'>
            <select onChange={(e) => setStart(e.target.value)} className='form__select'>
              <option value="Львів">Львів</option>
              <option value="Київ">Київ</option>
              <option value="Одеса">Одеса</option>
              <option value="Харків">Харків</option>
              <option value="Дніпро">Дніпро</option>
            </select>

            <select onChange={(e) => setEnd(e.target.value)} className='form__select'>
              <option value="Львів">Львів</option>
              <option value="Київ" selected>Київ</option>
              <option value="Одеса">Одеса</option>
              <option value="Харків">Харків</option>
              <option value="Дніпро">Дніпро</option>
            </select>

            <button onClick={showHandler}>pick date</button>
            <input type="checkbox" id="7days" name="7days" onChange={() => setSevenDays((cur => !cur))}></input>
            <label for="7days" onChange={(cur) => setSevenDays(!cur)}>for 7 days?</label><br></br>
            <button onClick={searchHandler}>search</button>

          </div>
        
          { show && <Calendar onChange={setDataHandler}></Calendar> }
        </form>

        <div className='res'>
          {
            trains.length > 0
              ? (
                <table>
                  <thead>
                    <tr>
                      <th>departure from { start }</th>
                      <th>arrival to { end }</th>
                      <th>train number</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      trains.map((t, i) => (
                        <tr key={i}>
                          <td>{ moment(t.departure_time).format('DD-MM-YYYY HH:mm') }</td>
                          <td>{ moment(t.arrival_time).format('DD-MM-YYYY HH:mm') }</td>
                          <td>{ t.train_number }</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )
              : 'no trains for this date'
          }
        </div>
      </div>
    </div>
  );
}

export default App;
