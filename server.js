/**
 * Simple Express server to serve Freemarker templates
 * This simulates a basic Freemarker environment
 */

const express = require("express")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files
app.use("/static", express.static(path.join(__dirname, "src/main/resources/static")))

// Mock employee data (simulating what would come from backend)
const mockEmployeeList = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    department: "IT",
    role: "Manager",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    department: "HR",
    role: "Specialist",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@company.com",
    department: "Finance",
    role: "Analyst",
  },
  // Add more mock data as needed
]

// Route to serve the main page
app.get("/", (req, res) => {
  // Read the Freemarker template
  const templatePath = path.join(__dirname, "src/main/resources/templates/index.ftlh")

  fs.readFile(templatePath, "utf8", (err, template) => {
    if (err) {
      console.error("Error reading template:", err)
      return res.status(500).send("Error loading template")
    }

    // Simple Freemarker simulation - replace template variables
    let html = template

    // Replace Freemarker list iteration with actual HTML
    const employeeCardsHtml = mockEmployeeList
      .map(
        (employee) => `
      <div class="employee-card" data-employee-id="${employee.id}">
        <div class="employee-card__header">
          <h3 class="employee-card__name">${employee.firstName} ${employee.lastName}</h3>
          <span class="employee-card__id">ID: ${employee.id}</span>
        </div>
        
        <div class="employee-card__info">
          <p class="employee-card__email">
            <span class="employee-card__label">Email:</span>
            ${employee.email}
          </p>
          <p class="employee-card__department">
            <span class="employee-card__label">Department:</span>
            ${employee.department}
          </p>
          <p class="employee-card__role">
            <span class="employee-card__label">Role:</span>
            ${employee.role}
          </p>
        </div>
        
        <div class="employee-card__actions">
          <button class="btn btn--small btn--primary edit-btn" data-id="${employee.id}">
            Edit
          </button>
          <button class="btn btn--small btn--danger delete-btn" data-id="${employee.id}">
            Delete
          </button>
        </div>
      </div>
    `,
      )
      .join("")

    // Replace the Freemarker list directive with actual HTML
    html = html.replace(/<#assign employees = mockEmployeeList>[\s\S]*?<\/#list>/, employeeCardsHtml)

    res.send(html)
  })
})

// API endpoints for AJAX operations (optional enhancement)
app.use(express.json())

app.get("/api/employees", (req, res) => {
  res.json(mockEmployeeList)
})

app.post("/api/employees", (req, res) => {
  const newEmployee = {
    id: Date.now(),
    ...req.body,
  }
  mockEmployeeList.push(newEmployee)
  res.json(newEmployee)
})

app.put("/api/employees/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = mockEmployeeList.findIndex((emp) => emp.id === id)

  if (index !== -1) {
    mockEmployeeList[index] = { ...mockEmployeeList[index], ...req.body }
    res.json(mockEmployeeList[index])
  } else {
    res.status(404).json({ error: "Employee not found" })
  }
})

app.delete("/api/employees/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = mockEmployeeList.findIndex((emp) => emp.id === id)

  if (index !== -1) {
    const deleted = mockEmployeeList.splice(index, 1)[0]
    res.json(deleted)
  } else {
    res.status(404).json({ error: "Employee not found" })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
  console.log(`📁 Serving static files from: ${path.join(__dirname, "src/main/resources/static")}`)
  console.log(`📄 Template directory: ${path.join(__dirname, "src/main/resources/templates")}`)
})
