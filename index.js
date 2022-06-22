const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
      id: 1234567,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2234567,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3234567,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4234567,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    }
  ]

// Palauttaa tallennettujen yhteystietojen määrän ja nykyisen ajan 
app.get('/info', (req, res) => {
    res.send(`<p>The App contains currently contact information for ${persons.length} persons<p/>
              <p>${new Date()}<p/>`)
})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// Palauttaa tunnistetta vastaavan yhteystiedon
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('id on: ',id)
  const person = persons.find(person => person.id === id)
  response.json(person)
})

// Luo uudelle yhteystiedolle tunnisteen ja tarkistaa ettei se ole jo käytössä
const generateId = () => {
  check = true
  while (check){
    newId = Math.floor(Math.random() * 9999999)
    if (persons.some(({id}) => id === newId)) continue
    check = false
    return newId
  }
}

// Tallentaa uuden yhteystiedon
app.post('/api/persons', (request, response) => {

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name is already on the phonebook' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  

  persons = persons.concat(person)

  response.json(person)
})

// Poistaa tunnistetta vastaavan yhteystiedon
app.delete('/api/persons/:id', (req, res) => {
  
  const id = Number(req.params.id)
  if (persons.some(person => person.id === id)) {
    const newPersons = persons.filter(person => person.id !== id)
    persons = newPersons
    res.send(`got a DELETE request at /api/persons/${id}`)
    
  }
})
  
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})