const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('data', getData = (req, res) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "050-1123889"
  },
  {
    id: 3,
    name: "Arska Miettinen",
    number: "044-5944612"
  },
  {
    id: 4,
    name: "Jorma Juurikkala",
    number: "0400-445998"
  }
]

const generateId = () => {
  const max = 10000000
  return Math.floor(Math.random() * max) 
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.number && !person.name) {
    return response.status(400).json({
      error: 'name and number missing'
    })
  }

  if (!person.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!person.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.filter(p => p.name === person.name).length > 0) {
    return response.status(400).json({
      error: 'person exists in phonebook'
    })
  }

  person.id = generateId()
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})