/**
 * Mock Employee Data
 * This simulates the data that would be passed from Freemarker template
 */

// Mock employee data - this would typically come from a backend service
const mockEmployees = [
  { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@company.com", department: "HR", role: "Manager" },
  { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@company.com", department: "IT", role: "Developer" },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@company.com",
    department: "Finance",
    role: "Analyst",
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    department: "Marketing",
    role: "Manager",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@company.com",
    department: "IT",
    role: "Developer",
  },
  { id: 6, firstName: "Sarah", lastName: "Brown", email: "sarah.brown@company.com", department: "HR", role: "Analyst" },
  {
    id: 7,
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.taylor@company.com",
    department: "Finance",
    role: "Manager",
  },
  {
    id: 8,
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@company.com",
    department: "Marketing",
    role: "Developer",
  },
  {
    id: 9,
    firstName: "James",
    lastName: "Thomas",
    email: "james.thomas@company.com",
    department: "IT",
    role: "Analyst",
  },
  {
    id: 10,
    firstName: "Jennifer",
    lastName: "Jackson",
    email: "jennifer.jackson@company.com",
    department: "HR",
    role: "Manager",
  },
  {
    id: 11,
    firstName: "William",
    lastName: "White",
    email: "william.white@company.com",
    department: "Finance",
    role: "Developer",
  },
  {
    id: 12,
    firstName: "Amanda",
    lastName: "Harris",
    email: "amanda.harris@company.com",
    department: "Marketing",
    role: "Analyst",
  },
  {
    id: 13,
    firstName: "Christopher",
    lastName: "Martin",
    email: "christopher.martin@company.com",
    department: "IT",
    role: "Manager",
  },
  {
    id: 14,
    firstName: "Michelle",
    lastName: "Garcia",
    email: "michelle.garcia@company.com",
    department: "HR",
    role: "Developer",
  },
  {
    id: 15,
    firstName: "Daniel",
    lastName: "Rodriguez",
    email: "daniel.rodriguez@company.com",
    department: "Finance",
    role: "Analyst",
  },
  {
    id: 16,
    firstName: "Ashley",
    lastName: "Lewis",
    email: "ashley.lewis@company.com",
    department: "Marketing",
    role: "Manager",
  },
  {
    id: 17,
    firstName: "Matthew",
    lastName: "Lee",
    email: "matthew.lee@company.com",
    department: "IT",
    role: "Developer",
  },
  {
    id: 18,
    firstName: "Jessica",
    lastName: "Walker",
    email: "jessica.walker@company.com",
    department: "HR",
    role: "Analyst",
  },
  {
    id: 19,
    firstName: "Andrew",
    lastName: "Hall",
    email: "andrew.hall@company.com",
    department: "Finance",
    role: "Manager",
  },
  {
    id: 20,
    firstName: "Stephanie",
    lastName: "Allen",
    email: "stephanie.allen@company.com",
    department: "Marketing",
    role: "Developer",
  },
]

// Simulate Freemarker data assignment
// In a real Freemarker environment, this would be: <#assign mockEmployeeList = employees>
window.mockEmployeeList = mockEmployees
window.employeeData = mockEmployees

// Department and Role options for dropdowns
const departmentOptions = ["HR", "IT", "Finance", "Marketing", "Operations"]
const roleOptions = ["Manager", "Developer", "Analyst", "Coordinator", "Specialist"]

// Export for use in other modules
window.departmentOptions = departmentOptions
window.roleOptions = roleOptions
