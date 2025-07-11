/**
 * Employee Directory Application
 * Main application logic for managing employees
 */

class EmployeeDirectoryApp {
  constructor() {
    this.employees = [...window.employeeData]
    this.filteredEmployees = [...this.employees]
    this.currentPage = 1
    this.itemsPerPage = 10
    this.isEditMode = false
    this.editingId = null

    // State management for filters and sorting
    this.currentSort = { field: "", direction: "asc" }
    this.currentFilters = {
      search: "",
      firstName: "",
      department: "",
      role: "",
    }
  }

  /**
   * Initialize the application
   */
  init() {
    this.bindEvents()
    this.updateStats()
    this.applyFiltersAndSort()
    this.renderEmployees()
    this.updatePagination()
    console.log("Employee Directory App initialized successfully")
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Add Employee Button
    document.getElementById("add-employee-btn").addEventListener("click", () => {
      this.showAddForm()
    })

    // Search
    const searchInput = document.getElementById("search-input")
    searchInput.addEventListener("input", (e) => {
      this.handleSearch(e.target.value)
    })

    // Clear search
    document.getElementById("clear-search").addEventListener("click", () => {
      searchInput.value = ""
      this.handleSearch("")
    })

    // Filter
    document.getElementById("filter-btn").addEventListener("click", () => {
      this.toggleFilterPanel()
    })

    document.getElementById("close-filter").addEventListener("click", () => {
      this.closeFilterPanel()
    })

    document.getElementById("apply-filter-btn").addEventListener("click", () => {
      this.applyFilters()
    })

    document.getElementById("clear-filter-btn").addEventListener("click", () => {
      this.clearFilters()
    })

    // Sort
    document.getElementById("sort-select").addEventListener("change", (e) => {
      this.handleSort(e.target.value)
    })

    // Pagination
    document.getElementById("items-per-page").addEventListener("change", (e) => {
      this.itemsPerPage = Number.parseInt(e.target.value)
      this.currentPage = 1
      this.renderEmployees()
      this.updatePagination()
    })

    document.getElementById("prev-btn").addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--
        this.renderEmployees()
        this.updatePagination()
      }
    })

    document.getElementById("next-btn").addEventListener("click", () => {
      const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage)
      if (this.currentPage < totalPages) {
        this.currentPage++
        this.renderEmployees()
        this.updatePagination()
      }
    })

    // Modal
    document.getElementById("close-modal").addEventListener("click", () => {
      this.hideModal()
    })

    document.getElementById("cancel-btn").addEventListener("click", () => {
      this.hideModal()
    })

    // Form
    document.getElementById("employee-form").addEventListener("submit", (e) => {
      this.handleFormSubmit(e)
    })

    // Close modal when clicking backdrop
    document.querySelector(".modal-backdrop").addEventListener("click", () => {
      this.hideModal()
    })

    // Close filter panel when clicking outside
    document.addEventListener("click", (e) => {
      const filterPanel = document.getElementById("filter-panel")
      const filterBtn = document.getElementById("filter-btn")

      if (!filterPanel.contains(e.target) && !filterBtn.contains(e.target)) {
        this.closeFilterPanel()
      }
    })
  }

  /**
   * Update statistics cards
   */
  updateStats() {
    const totalEmployees = this.employees.length
    const departments = [...new Set(this.employees.map((emp) => emp.department))].length
    const filteredCount = this.filteredEmployees.length

    document.getElementById("total-employees").textContent = totalEmployees
    document.getElementById("total-departments").textContent = departments
    document.getElementById("filtered-count").textContent = filteredCount
  }

  /**
   * Handle search functionality
   * @param {string} query - Search query
   */
  handleSearch(query) {
    this.currentFilters.search = query

    // Show/hide clear search button
    const clearBtn = document.getElementById("clear-search")
    if (query.trim()) {
      clearBtn.classList.remove("hidden")
    } else {
      clearBtn.classList.add("hidden")
    }

    this.currentPage = 1
    this.applyFiltersAndSort()
    this.renderEmployees()
    this.updatePagination()
    this.updateStats()
  }

  /**
   * Toggle filter panel visibility
   */
  toggleFilterPanel() {
    const panel = document.getElementById("filter-panel")
    panel.classList.toggle("hidden")
  }

  /**
   * Close filter panel
   */
  closeFilterPanel() {
    const panel = document.getElementById("filter-panel")
    panel.classList.add("hidden")
  }

  /**
   * Apply filters to employee list
   */
  applyFilters() {
    this.currentFilters.firstName = document.getElementById("filter-firstName").value.toLowerCase()
    this.currentFilters.department = document.getElementById("filter-department").value
    this.currentFilters.role = document.getElementById("filter-role").value

    this.updateFilterBadge()
    this.currentPage = 1
    this.applyFiltersAndSort()
    this.renderEmployees()
    this.updatePagination()
    this.updateStats()
    this.closeFilterPanel()
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    document.getElementById("filter-firstName").value = ""
    document.getElementById("filter-department").value = ""
    document.getElementById("filter-role").value = ""

    this.currentFilters.firstName = ""
    this.currentFilters.department = ""
    this.currentFilters.role = ""

    this.updateFilterBadge()
    this.currentPage = 1
    this.applyFiltersAndSort()
    this.renderEmployees()
    this.updatePagination()
    this.updateStats()
  }

  /**
   * Update filter badge count
   */
  updateFilterBadge() {
    const activeFilters = Object.values(this.currentFilters).filter(
      (value) => value && value !== this.currentFilters.search,
    ).length

    const badge = document.getElementById("filter-badge")
    if (activeFilters > 0) {
      badge.textContent = activeFilters
      badge.classList.remove("hidden")
    } else {
      badge.classList.add("hidden")
    }
  }

  /**
   * Handle sorting
   * @param {string} sortValue - Sort field and direction (e.g., "firstName-asc")
   */
  handleSort(sortValue) {
    if (!sortValue) {
      this.currentSort = { field: "", direction: "asc" }
    } else {
      const [field, direction] = sortValue.split("-")
      this.currentSort = { field, direction }
    }

    this.applyFiltersAndSort()
    this.renderEmployees()
  }

  /**
   * Apply all filters and sorting to the employee list
   */
  applyFiltersAndSort() {
    let result = [...this.employees]

    // Apply search filter
    if (this.currentFilters.search) {
      const searchLower = this.currentFilters.search.toLowerCase()
      result = result.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchLower) ||
          emp.lastName.toLowerCase().includes(searchLower) ||
          emp.email.toLowerCase().includes(searchLower),
      )
    }

    // Apply other filters
    if (this.currentFilters.firstName) {
      result = result.filter((emp) => emp.firstName.toLowerCase().includes(this.currentFilters.firstName))
    }

    if (this.currentFilters.department) {
      result = result.filter((emp) => emp.department === this.currentFilters.department)
    }

    if (this.currentFilters.role) {
      result = result.filter((emp) => emp.role === this.currentFilters.role)
    }

    // Apply sorting
    if (this.currentSort.field) {
      result.sort((a, b) => {
        const aValue = a[this.currentSort.field].toLowerCase()
        const bValue = b[this.currentSort.field].toLowerCase()

        if (this.currentSort.direction === "asc") {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    }

    this.filteredEmployees = result
  }

  /**
   * Render employee list with pagination
   */
  renderEmployees() {
    const container = document.getElementById("employee-list-container")
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    const employeesToShow = this.filteredEmployees.slice(startIndex, endIndex)

    if (employeesToShow.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No employees found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `
      return
    }

    container.innerHTML = employeesToShow
      .map(
        (emp) => `
        <div class="employee-card">
          <h3>${this.escapeHtml(emp.firstName)} ${this.escapeHtml(emp.lastName)}</h3>
          <span class="employee-id">ID: ${emp.id}</span>
          <p><strong>Email:</strong> ${this.escapeHtml(emp.email)}</p>
          <p><strong>Department:</strong> ${this.escapeHtml(emp.department)}</p>
          <p><strong>Role:</strong> ${this.escapeHtml(emp.role)}</p>
          <div class="employee-actions">
            <button class="btn btn-primary" onclick="window.employeeApp.showEditForm(${emp.id})">
              <span class="btn-icon">✏️</span>
              Edit
            </button>
            <button class="btn btn-danger" onclick="window.employeeApp.deleteEmployee(${emp.id})">
              <span class="btn-icon">🗑️</span>
              Delete
            </button>
          </div>
        </div>
      `,
      )
      .join("")
  }

  /**
   * Update pagination controls
   */
  updatePagination() {
    const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage)
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredEmployees.length)

    // Update pagination text
    document.getElementById("pagination-text").textContent =
      `Showing ${startItem}-${endItem} of ${this.filteredEmployees.length} employees`

    // Update buttons
    document.getElementById("prev-btn").disabled = this.currentPage === 1
    document.getElementById("next-btn").disabled = this.currentPage === totalPages || totalPages === 0

    // Update page numbers
    this.renderPageNumbers(totalPages)
  }

  /**
   * Render page numbers
   * @param {number} totalPages - Total number of pages
   */
  renderPageNumbers(totalPages) {
    const container = document.getElementById("page-numbers")

    if (totalPages <= 1) {
      container.innerHTML = ""
      return
    }

    const maxVisible = 5
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
    const endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    let html = ""

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      html += `<button class="page-number" onclick="window.employeeApp.goToPage(1)">1</button>`
      if (startPage > 2) {
        html += `<span class="page-ellipsis">...</span>`
      }
    }

    // Add page numbers in range
    for (let i = startPage; i <= endPage; i++) {
      html += `
        <button class="page-number ${i === this.currentPage ? "active" : ""}" 
                onclick="window.employeeApp.goToPage(${i})">${i}</button>
      `
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += `<span class="page-ellipsis">...</span>`
      }
      html += `<button class="page-number" onclick="window.employeeApp.goToPage(${totalPages})">${totalPages}</button>`
    }

    container.innerHTML = html
  }

  /**
   * Go to specific page
   * @param {number} page - Page number
   */
  goToPage(page) {
    this.currentPage = page
    this.renderEmployees()
    this.updatePagination()
  }

  /**
   * Show add employee form
   */
  showAddForm() {
    this.isEditMode = false
    this.editingId = null
    document.getElementById("form-title").textContent = "Add New Employee"
    this.clearForm()
    this.showModal()
  }

  /**
   * Show edit employee form
   * @param {number} id - Employee ID
   */
  showEditForm(id) {
    this.isEditMode = true
    this.editingId = id
    const employee = this.employees.find((emp) => emp.id === id)

    if (employee) {
      document.getElementById("form-title").textContent = "Edit Employee"
      document.getElementById("firstName").value = employee.firstName
      document.getElementById("lastName").value = employee.lastName
      document.getElementById("email").value = employee.email
      document.getElementById("department").value = employee.department
      document.getElementById("role").value = employee.role
      this.showModal()
    }
  }

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  handleFormSubmit(e) {
    e.preventDefault()

    const formData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value,
      role: document.getElementById("role").value,
    }

    // Validate form
    if (!this.validateForm(formData)) {
      return
    }

    this.showLoading()

    // Simulate API delay
    setTimeout(() => {
      if (this.isEditMode) {
        this.updateEmployee(formData)
      } else {
        this.addEmployee(formData)
      }

      this.hideLoading()
      this.hideModal()

      // Maintain current state after CRUD operations
      this.applyFiltersAndSort()
      this.renderEmployees()
      this.updatePagination()
      this.updateStats()
    }, 500)
  }

  /**
   * Validate form data
   * @param {Object} data - Form data
   * @returns {boolean} Is form valid
   */
  validateForm(data) {
    let isValid = true

    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))
    document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"))

    // Validate required fields
    Object.keys(data).forEach((field) => {
      if (!data[field]) {
        document.getElementById(`${field}-error`).textContent = "This field is required"
        document.getElementById(field).classList.add("error")
        isValid = false
      }
    })

    // Validate email format
    if (data.email && !this.isValidEmail(data.email)) {
      document.getElementById("email-error").textContent = "Please enter a valid email address"
      document.getElementById("email").classList.add("error")
      isValid = false
    }

    // Check for duplicate email
    if (data.email && this.isDuplicateEmail(data.email)) {
      document.getElementById("email-error").textContent = "This email is already in use"
      document.getElementById("email").classList.add("error")
      isValid = false
    }

    return isValid
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is email valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Check for duplicate email
   * @param {string} email - Email to check
   * @returns {boolean} Is email duplicate
   */
  isDuplicateEmail(email) {
    return this.employees.some((emp) => emp.email.toLowerCase() === email.toLowerCase() && emp.id !== this.editingId)
  }

  /**
   * Add new employee
   * @param {Object} data - Employee data
   */
  addEmployee(data) {
    const newEmployee = {
      id: Math.max(...this.employees.map((emp) => emp.id)) + 1,
      ...data,
    }

    this.employees.push(newEmployee)
    this.showToast("success", "Employee Added", "Employee has been successfully added to the directory.")
  }

  /**
   * Update existing employee
   * @param {Object} data - Employee data
   */
  updateEmployee(data) {
    const index = this.employees.findIndex((emp) => emp.id === this.editingId)
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...data }
      this.showToast("success", "Employee Updated", "Employee information has been successfully updated.")
    }
  }

  /**
   * Delete employee
   * @param {number} id - Employee ID
   */
  deleteEmployee(id) {
    const employee = this.employees.find((emp) => emp.id === id)
    if (employee && confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.employees = this.employees.filter((emp) => emp.id !== id)

      // Maintain current state after deletion
      this.applyFiltersAndSort()
      this.renderEmployees()
      this.updatePagination()
      this.updateStats()

      this.showToast("success", "Employee Deleted", "Employee has been successfully removed from the directory.")
    }
  }

  /**
   * Show modal
   */
  showModal() {
    const modal = document.getElementById("form-modal")
    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"

    // Focus on first input
    setTimeout(() => {
      document.getElementById("firstName").focus()
    }, 100)
  }

  /**
   * Hide modal
   */
  hideModal() {
    const modal = document.getElementById("form-modal")
    modal.classList.add("hidden")
    document.body.style.overflow = ""
    this.clearForm()
  }

  /**
   * Clear form fields
   */
  clearForm() {
    document.getElementById("employee-form").reset()
    document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""))
    document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"))
  }

  /**
   * Show loading overlay
   */
  showLoading() {
    document.getElementById("loading-overlay").classList.remove("hidden")
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    document.getElementById("loading-overlay").classList.add("hidden")
  }

  /**
   * Show toast notification
   * @param {string} type - Toast type (success, error)
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   */
  showToast(type, title, message) {
    const container = document.getElementById("toast-container")
    const toast = document.createElement("div")

    toast.className = `toast toast-${type}`
    toast.innerHTML = `
      <div class="toast-icon">${type === "success" ? "✅" : "❌"}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `

    container.appendChild(toast)

    // Show toast
    setTimeout(() => toast.classList.add("show"), 100)

    // Hide toast after 4 seconds
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => container.removeChild(toast), 300)
    }, 4000)
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create global app instance
  window.employeeApp = new EmployeeDirectoryApp()

  // Initialize the app
  window.employeeApp.init()
})

// Global error handler
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error)
  if (window.employeeApp) {
    window.employeeApp.showToast("error", "Error", "An unexpected error occurred. Please refresh the page.")
  }
})

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason)
  if (window.employeeApp) {
    window.employeeApp.showToast("error", "Error", "An unexpected error occurred. Please refresh the page.")
  }
})
