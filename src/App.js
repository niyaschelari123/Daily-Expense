import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {Table, Modal, Button, message, InputNumber, Popconfirm} from 'antd'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import {format} from 'date-fns'

function App() {
  const [dailyExpense, setDailyExpense] = useState(0)
  const [expenses, setExpenses] = useState([])
  const [finalValue, setFinalValue] = useState(0)
  const [visible, setVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState()
  const [latest, setlatest] = useState()
  const [newExpense, setNewExpense] = useState([])
  const [value, setValue] = useState(new Date())
  const [selDate, setSelDate] = useState('')
  const [visible2, setVisible2] = useState(false)
  const [monthWise, setMonthWise] = useState([])
  const [newMonthWise, setNewMonthWise] = useState(false)

  const i = [
    {
      date: '2023-9-12',
      dailyExpense: 350,
      savings: 0,
      extra: 100,
      cummulative: -100,
    },
    {
      date: '2023-9-13',
      dailyExpense: 100,
      savings: 150,
      extra: 0,
      cummulative: 150,
    },
  ]

  const monthsArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const columns2 = [
    {
      title: 'Month',
      key: 'month',
      render: (text, record) => (
        <span>
          {record.month1} - {record.month2}
        </span>
      ),
    },
    {
      title: 'Expense',
      dataIndex: 'expense',
      key: 'date',
    },
    {
      title: 'Savings',
      dataIndex: 'savings',
      key: 'date',
    },
  ]

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Expense',
      dataIndex: 'dailyExpense',
      key: 'dailyExpense',
    },
    {
      title: 'Savings',
      dataIndex: 'savings',
      key: 'savings',
    },
    {
      title: 'Extra',
      dataIndex: 'extra',
      key: 'extra',
    },
    {
      title: 'Cummulative',
      dataIndex: 'cummulative',
      key: 'cummulative',
      // render: (text, record) => Number(record.savings - record.extra),
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (text, record) => (
        <img
          src="/img/edit-icon.png"
          style={{maxWidth: '30px', cursor: 'pointer'}}
          onClick={() => handleModal(record)}
        />
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <img
          src="/img/delete-icon.png"
          style={{maxWidth: '30px', cursor: 'pointer'}}
          onClick={() => handleModal2(record)}
        />
      ),
    },
  ]

  const handleModal = (record) => {
    setSelectedDate(record.date)
    setVisible(true)
  }
  const handleModal2 = (record) => {
    console.log('data to be deleted', record)
    Modal.confirm({
      title: 'Confirm Action',
      content: 'Are you sure you want to delete date for the selected date ?',
      onOk() {
        const expenses2 = expenses.filter((item) => item.date !== record.date)
        localStorage.setItem('expenses', JSON.stringify(expenses2))
        setNewExpense(expenses2)
        message.success(`Data deleted for the date ${record.date}`)

        // Handle OK button click
        console.log('OK clicked')
      },
      onCancel() {
        // Handle Cancel button click
        console.log('Cancel clicked')
      },
    })
  }

  console.log('monthwise', monthWise)

  const handleExpenseChange = (event) => {
    setSelDate()
    setDailyExpense(parseFloat(event.target.value))
  }

  const handleExpenseChange2 = (value) => {
    setDailyExpense(parseFloat(value))
  }

  const handleExpenseSubmit = () => {
    const today = new Date()
    let date
    if (!selDate) {
      date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    } else {
      date = selDate
    }

    const y = expenses?.find((item) => item.date === date)
    if (y) {
      message.error('Data already Entered for this date')
    } else {
      const expenseData = {
        date,
        dailyExpense,
      }

      if (dailyExpense > 250) {
        expenseData.extra = Number(dailyExpense - 250)
        expenseData.savings = 0
        expenseData.cummulative = Number(250 - dailyExpense)
      } else {
        expenseData.savings = Number(250 - dailyExpense)
        expenseData.extra = 0
        expenseData.cummulative = Number(250 - dailyExpense)
      }

      setExpenses([...expenses, expenseData])
      setDailyExpense(0)
      message.success(`Data added for the date ${date}`)
    }
  }

  useEffect(() => {
    const x = localStorage.getItem('monthWiseData')
    const y = JSON.parse(x)
    setMonthWise(y)
  }, [newMonthWise])

  useEffect(() => {
    const x = localStorage.getItem('expenses')
    if (x) {
      const y = JSON.parse(x).sort()
      const z = [...y].reverse()

      setExpenses(z)
    }
  }, [newExpense])

  useEffect(() => {
    // Calculate cumulative savings and extras
    let cumulativeSavings = 0
    let cumulativeExtras = 0

    expenses.forEach((expense) => {
      if (expense.savings) {
        cumulativeSavings += expense.savings
      }

      if (expense.extra) {
        cumulativeExtras += expense.extra
      }
    })

    // Calculate final value
    const finalValue = 250 - cumulativeSavings + cumulativeExtras
    setFinalValue(finalValue)

    // Update local storage for expenses and final value
    localStorage.setItem('expenses', JSON.stringify(expenses))
    localStorage.setItem('finalValue', finalValue)
  }, [expenses])

  let totalSavings = expenses.reduce(
    (total, item) => total + item.cummulative,
    0,
  )

  const handleCancel = () => {
    setVisible(false)
  }

  const handleOk = () => {
    const expenses2 = expenses.filter((item) => item.date !== selectedDate)
    const uv = {}
    uv.date = selectedDate
    uv.dailyExpense = latest
    if (latest > 250) {
      uv.extra = Number(latest - 250)
      uv.savings = 0
      uv.cummulative = Number(250 - latest)
      expenses2.push(uv)
    } else {
      uv.savings = Number(250 - latest)
      uv.extra = 0
      uv.cummulative = Number(250 - latest)
      expenses2.push(uv)
    }
    setNewExpense(expenses2)
    localStorage.setItem('expenses', JSON.stringify(expenses2))
    message.success(`Data Updated for the date ${selectedDate}`)
    setVisible(false)
  }

  console.log('new array', newExpense)
  console.log('selected date', selectedDate)

  const onChange = (value) => {
    const formatteddate = format(value, 'yyyy-MM-dd')
    const mydate = `${value.getFullYear()}-${
      value.getMonth() + 1
    }-${value.getDate()}`
    console.log('value is', mydate)
    setValue(value)
    setSelDate(mydate)
  }

  const storageClear = () => {
    Modal.confirm({
      title: 'Confirm Action',
      content: 'Are you sure you want to clear Local Storage ?',
      onOk() {
        // const date = new Date()
        // let x = localStorage.getItem('monthWiseData')
        // const finalArray = JSON.parse(x)
        // console.log('current month name', monthsArray[date.getMonth()])

        // const expenseData = 7500 - totalSavings
        // const savingsData = expenses.reduce(
        //   (total, value) => total + value.savings,
        // )

        // console.log('niyas', expenseData, savingsData)

        // const fixedData = {
        //   month1: monthsArray[date.getMonth()],
        //   month2: monthsArray[date.getMonth() - 1],
        //   expense: 7500 - totalSavings,
        //   savings: expenseData > 7500 ? 0 : Math.abs(totalSavings),
        // }

        // finalArray.push(fixedData)
        // localStorage.setItem('monthWiseData', JSON.stringify(finalArray))
        // setNewMonthWise(!newMonthWise)

        const keyToRemove = 'expenses' // Replace 'yourKey' with the actual key you want to remove
        localStorage.removeItem(keyToRemove)
        setExpenses([])
        message.success(`Local Storage Cleared`)

        // Handle OK button click
        console.log('OK clicked')
      },
      onCancel() {
        // Handle Cancel button click
        console.log('Cancel clicked')
      },
    })
  }

  const handleCancel2 = () => {
    setVisible2(false)
  }

  const handleOk2 = () => {
    setVisible2(false)
  }

  return (
    <div style={{marginLeft: "auto", width: "100vw"}}>
      {/* <button
        onClick={() => {
          localStorage.setItem('expenses', JSON.stringify(i))
        }}
      >
        Click
      </button> */}
      <h1 onClick={() => setVisible2(true)} style={{cursor: 'pointer'}}>
        Daily Expense Tracker
      </h1>
      <input
        type="number"
        placeholder="Enter Daily Expense"
        value={dailyExpense}
        onChange={handleExpenseChange}
      />
      <button onClick={handleExpenseSubmit}>Submit</button>
      <div>
        <h2>Expense List</h2>
        <Table columns={columns} dataSource={expenses} />
        <div style={{display: 'flex', gap: '15px'}}>
          <h3 style={{margin: 0}}>
            {totalSavings >= 0 ? 'Congrats...You saved' : 'You spent Extra'}
          </h3>
          <h2 style={{color: 'red', marginTop: '-4px'}}>
            {Math.abs(totalSavings)} ₹
          </h2>
          <h3 style={{margin: 0}}>This Month</h3>
        </div>
        <div>
          <h3 style={{textAlign: 'center'}}>
            Forgot to add Expense for a date ?
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              justifyContent: 'center',
            }}
          >
            <DatePicker onChange={onChange} value={value} />
            <InputNumber
              style={{width: '100%'}}
              placeholder="Enter Expense"
              onChange={handleExpenseChange2}
            />
            <Button onClick={handleExpenseSubmit} type="primary">
              Submit
            </Button>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <h4>Month End ? Clear local storage ?</h4>
              <Button onClick={storageClear} type="primary">
                Clear
              </Button>
            </div>
          </div>
        </div>
        {/* <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              Date: {expense.date}, Expense: {expense.dailyExpense}
              {expense.extra && <span>, Extra: {expense.extra}</span>}
              {expense.savings && <span>, Savings: {expense.savings}</span>}
            </li>
          ))}
        </ul> */}
      </div>
      <Modal
        title={`Edit Expense for the date ${selectedDate}`}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <input
          style={{marginTop: '25px', fontSize: '14px', padding: '5px'}}
          type="number"
          placeholder="Please enter latest Expense"
          onChange={(e) => setlatest(e.target.value)}
        />
      </Modal>
      <Modal
        title={`Month-wise Expenses and Savings`}
        visible={visible2}
        onCancel={handleCancel2}
        onOk={handleOk2}
      >
        <Table columns={columns2} dataSource={monthWise} />
      </Modal>

      {/* <div>
        <h2>Final Value</h2>
        <p>{finalValue}</p>
      </div> */}
    </div>
  )
}

export default App;
