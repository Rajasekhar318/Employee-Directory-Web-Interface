/**
 * Build script to convert Freemarker template to static HTML
 * Useful for deployment or testing without a server
 */

const fs = require("fs")
const path = require("path")

// Mock data
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
  // Add more mock data...
]

function buildStaticHTML() {
  const templatePath = path.join(__dirname, "src/main/resources/templates/index.ftlh")
  const outputPath = path.join(__dirname, "dist/index.html")

  // Ensure dist directory exists
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist")
  }

  // Read template
  const template = fs.readFileSync(templatePath, "utf8")

  // Generate employee cards HTML
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

  // Replace Freemarker template with static HTML
  let html = template
  html = html.replace(/<#assign employees = mockEmployeeList>[\s\S]*?<\/#list>/, employeeCardsHtml)

  // Update static file paths for standalone HTML
  html = html.replace(/\/static\//g, "./src/main/resources/static/")

  // Write output file
  fs.writeFileSync(outputPath, html)

  console.log("✅ Static HTML built successfully!")
  console.log(`📄 Output: ${outputPath}`)
}

buildStaticHTML()
