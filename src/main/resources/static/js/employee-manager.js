/**
 * Employee Manager Module
 * Handles all employee data operations (CRUD)
 */

// Declare Utils and Validation variables
const Utils = {
  filterArray: (array, filters) => {
    return array.filter((item) => {
      return Object.keys(filters).every((key) => {
        return item[key] === filters[key]
      })
    })
  },
  searchArray: (array, query, fields) => {
    return array.filter((item) => {
      return fields.some((field) => {
        return item[field].toLowerCase().includes(query.toLowerCase())
      })
    })
  },
  sortByProperty: (array, field, direction) => {
    return array.sort((a, b) => {
      if (a[field] < b[field]) {
        return direction === "asc" ? -1 : 1
      }
      if (a[field] > b[field]) {
        return direction === "asc" ? 1 : -1
      }
      return 0
    })
  },
  generateId: () => {
    return Math.floor(Math.random() * 1000000)
  },
}

const Validation = {
  validateEmployeeForm: (employeeData) => {
    const errors = {}
    if (!employeeData.firstName) {
      errors.firstName = "First name is required"
    }
    if (!employeeData.lastName) {
      errors.lastName = "Last name is required"
    }
    if (!employeeData.email) {
      errors.email = "Email is required"
    }
    if (!employeeData.department) {
      errors.department = "Department is required"
    }
    if (!employeeData.role) {
      errors.role = "Role is required"
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },
}

class EmployeeManager {
  constructor() {
    // Initialize with mock data
    this.employees = [...window.mockEmployeeList]
    this.filteredEmployees = [...this.employees]
    this.currentFilters = {}
    this.currentSort = { field: "", direction: "asc" }
    this.searchQuery = ""
  }

  /**
   * Get all employees
   * @returns {Array} Array of employees
   */
  getAllEmployees() {
    return [...this.employees]
  }

  /**
   * Get filtered and sorted employees
   * @returns {Array} Array of processed employees
   */
  getProcessedEmployees() {
    let result = [...this.employees]

    // Apply filters
    if (Object.keys(this.currentFilters).length > 0) {
      result = Utils.filterArray(result, this.currentFilters)
    }

    // Apply search
    if (this.searchQuery) {
      result = Utils.searchArray(result, this.searchQuery, ["firstName", "lastName", "email", "department", "role"])
    }

    // Apply sorting
    if (this.currentSort.field) {
      result = Utils.sortByProperty(result, this.currentSort.field, this.currentSort.direction)
    }

    this.filteredEmployees = result
    return result
  }

  /**
   * Get employee by ID
   * @param {number} id - Employee ID
   * @returns {Object|null} Employee object or null if not found
   */
  getEmployeeById(id) {
    return this.employees.find((emp) => emp.id === Number.parseInt(id)) || null
  }

  /**
   * Add new employee
   * @param {Object} employeeData - Employee data
   * @returns {Object} Result object with success status and data
   */
  addEmployee(employeeData) {
    try {
      // Validate data
      const validation = Validation.validateEmployeeForm(employeeData)
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
          message: "Please fix the validation errors",
        }
      }

      // Check for duplicate email
      const existingEmployee = this.employees.find(
        (emp) => emp.email.toLowerCase() === employeeData.email.toLowerCase(),
      )

      if (existingEmployee) {
        return {
          success: false,
          errors: { email: "An employee with this email already exists" },
          message: "Email already exists",
        }
      }

      // Create new employee
      const newEmployee = {
        id: Utils.generateId(),
        firstName: employeeData.firstName.trim(),
        lastName: employeeData.lastName.trim(),
        email: employeeData.email.trim().toLowerCase(),
        department: employeeData.department,
        role: employeeData.role,
      }

      // Add to employees array
      this.employees.push(newEmployee)

      return {
        success: true,
        data: newEmployee,
        message: "Employee added successfully",
      }
    } catch (error) {
      console.error("Error adding employee:", error)
      return {
        success: false,
        message: "An error occurred while adding the employee",
      }
    }
  }

  /**
   * Update existing employee
   * @param {number} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Object} Result object with success status and data
   */
  updateEmployee(id, employeeData) {
    try {
      // Find employee
      const employeeIndex = this.employees.findIndex((emp) => emp.id === Number.parseInt(id))
      if (employeeIndex === -1) {
        return {
          success: false,
          message: "Employee not found",
        }
      }

      // Validate data
      const validation = Validation.validateEmployeeForm(employeeData)
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
          message: "Please fix the validation errors",
        }
      }

      // Check for duplicate email (excluding current employee)
      const existingEmployee = this.employees.find(
        (emp) => emp.id !== Number.parseInt(id) && emp.email.toLowerCase() === employeeData.email.toLowerCase(),
      )

      if (existingEmployee) {
        return {
          success: false,
          errors: { email: "An employee with this email already exists" },
          message: "Email already exists",
        }
      }

      // Update employee
      const updatedEmployee = {
        ...this.employees[employeeIndex],
        firstName: employeeData.firstName.trim(),
        lastName: employeeData.lastName.trim(),
        email: employeeData.email.trim().toLowerCase(),
        department: employeeData.department,
        role: employeeData.role,
      }

      this.employees[employeeIndex] = updatedEmployee

      return {
        success: true,
        data: updatedEmployee,
        message: "Employee updated successfully",
      }
    } catch (error) {
      console.error("Error updating employee:", error)
      return {
        success: false,
        message: "An error occurred while updating the employee",
      }
    }
  }

  /**
   * Delete employee
   * @param {number} id - Employee ID
   * @returns {Object} Result object with success status
   */
  deleteEmployee(id) {
    try {
      const employeeIndex = this.employees.findIndex((emp) => emp.id === Number.parseInt(id))
      if (employeeIndex === -1) {
        return {
          success: false,
          message: "Employee not found",
        }
      }

      const deletedEmployee = this.employees[employeeIndex]
      this.employees.splice(employeeIndex, 1)

      return {
        success: true,
        data: deletedEmployee,
        message: "Employee deleted successfully",
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      return {
        success: false,
        message: "An error occurred while deleting the employee",
      }
    }
  }

  /**
   * Set search query
   * @param {string} query - Search query
   */
  setSearchQuery(query) {
    this.searchQuery = query.trim()
  }

  /**
   * Set filters
   * @param {Object} filters - Filter criteria
   */
  setFilters(filters) {
    // Remove empty filters
    this.currentFilters = Object.keys(filters).reduce((acc, key) => {
      if (filters[key] && filters[key].trim()) {
        acc[key] = filters[key].trim()
      }
      return acc
    }, {})
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.currentFilters = {}
  }

  /**
   * Set sorting
   * @param {string} field - Field to sort by
   * @param {string} direction - Sort direction ('asc' or 'desc')
   */
  setSorting(field, direction = "asc") {
    this.currentSort = { field, direction }
  }

  /**
   * Clear sorting
   */
  clearSorting() {
    this.currentSort = { field: "", direction: "asc" }
  }

  /**
   * Get current filters
   * @returns {Object} Current filters
   */
  getCurrentFilters() {
    return { ...this.currentFilters }
  }

  /**
   * Get current sort settings
   * @returns {Object} Current sort settings
   */
  getCurrentSort() {
    return { ...this.currentSort }
  }

  /**
   * Get search query
   * @returns {string} Current search query
   */
  getSearchQuery() {
    return this.searchQuery
  }

  /**
   * Get statistics
   * @returns {Object} Employee statistics
   */
  getStatistics() {
    const total = this.employees.length
    const filtered = this.filteredEmployees.length

    // Department breakdown
    const departmentStats = this.employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    }, {})

    // Role breakdown
    const roleStats = this.employees.reduce((acc, emp) => {
      acc[emp.role] = (acc[emp.role] || 0) + 1
      return acc
    }, {})

    return {
      total,
      filtered,
      departments: departmentStats,
      roles: roleStats,
    }
  }
}

// Make EmployeeManager available globally
window.EmployeeManager = EmployeeManager
