/**
 * UI Controller Module
 * Handles all UI interactions and DOM manipulation
 */

// Declare Utils and Validation variables
const Utils = {
  debounce: (func, wait) => {
    let timeout
    return function (...args) {
      
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  },
  showError: (message) => {
    console.error(message)
  },
  showSuccess: (message) => {
    console.log(message)
  },
  sanitizeHtml: (str) => {
    return str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m])
  },
  confirm: (message) => {
    return window.confirm(message)
  },
  paginate: (items, page, pageSize) => {
    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, items.length)
    return {
      items: items.slice(startIndex, endIndex),
      startIndex: startIndex + 1,
      endIndex: endIndex,
      totalItems: items.length,
      hasPrevPage: page > 1,
      hasNextPage: endIndex < items.length,
    }
  },
}

const Validation = {
  validateField: (fieldName, value) => {
    // Placeholder for field validation logic
    console.log(`Validating ${fieldName}: ${value}`)
  },
  displayErrors: (errors) => {
    console.error("Errors:", errors)
  },
  clearErrors: () => {
    console.log("Clearing errors")
  },
}

class UIController {
  constructor(employeeManager) {
    this.employeeManager = employeeManager
    this.currentPage = 1
    this.itemsPerPage = 10
    this.isEditMode = false
    this.editingEmployeeId = null

    this.initializeElements()
    this.bindEvents()
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    // Main containers
    this.dashboard = document.getElementById("dashboard")
    this.formSection = document.getElementById("form-section")
    this.employeeListContainer = document.getElementById("employee-list-container")

    // Form elements
    this.employeeForm = document.getElementById("employee-form")
    this.formTitle = document.getElementById("form-title")

    // Control elements
    this.searchInput = document.getElementById("search-input")
    this.sortSelect = document.getElementById("sort-select")
    this.filterPanel = document.getElementById("filter-panel")

    // Pagination elements
    this.paginationInfo = document.getElementById("pagination-info")
    this.pageNumbers = document.getElementById("page-numbers")
    this.itemsPerPageSelect = document.getElementById("items-per-page")

    // Buttons
    this.addEmployeeBtn = document.getElementById("add-employee-btn")
    this.filterBtn = document.getElementById("filter-btn")
    this.applyFilterBtn = document.getElementById("apply-filter-btn")
    this.clearFilterBtn = document.getElementById("clear-filter-btn")
    this.closeFilterBtn = document.getElementById("close-filter-btn")
    this.closeFormBtn = document.getElementById("close-form-btn")
    this.cancelBtn = document.getElementById("cancel-btn")
    this.prevPageBtn = document.getElementById("prev-page-btn")
    this.nextPageBtn = document.getElementById("next-page-btn")
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener(
        "input",
        Utils.debounce((e) => this.handleSearch(e.target.value), 300),
      )
    }

    // Sort functionality
    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", (e) => this.handleSort(e.target.value))
    }

    // Filter functionality
    if (this.filterBtn) {
      this.filterBtn.addEventListener("click", () => this.toggleFilterPanel())
    }

    if (this.applyFilterBtn) {
      this.applyFilterBtn.addEventListener("click", () => this.applyFilters())
    }

    if (this.clearFilterBtn) {
      this.clearFilterBtn.addEventListener("click", () => this.clearFilters())
    }

    if (this.closeFilterBtn) {
      this.closeFilterBtn.addEventListener("click", () => this.closeFilterPanel())
    }

    // Form functionality
    if (this.addEmployeeBtn) {
      this.addEmployeeBtn.addEventListener("click", () => this.showAddForm())
    }

    if (this.employeeForm) {
      this.employeeForm.addEventListener("submit", (e) => this.handleFormSubmit(e))
    }

    if (this.closeFormBtn) {
      this.closeFormBtn.addEventListener("click", () => this.closeForm())
    }

    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", () => this.closeForm())
    }

    // Pagination functionality
    if (this.itemsPerPageSelect) {
      this.itemsPerPageSelect.addEventListener("change", (e) => {
        this.itemsPerPage = Number.parseInt(e.target.value)
        this.currentPage = 1
        this.renderEmployeeList()
      })
    }

    if (this.prevPageBtn) {
      this.prevPageBtn.addEventListener("click", () => this.goToPreviousPage())
    }

    if (this.nextPageBtn) {
      this.nextPageBtn.addEventListener("click", () => this.goToNextPage())
    }

    // Real-time form validation
    const formFields = ["firstName", "lastName", "email", "department", "role"]
    formFields.forEach((fieldName) => {
      const field = document.getElementById(fieldName)
      if (field) {
        field.addEventListener("blur", () => {
          Validation.validateField(fieldName, field.value)
        })
      }
    })

    // Close filter panel when clicking outside
    document.addEventListener("click", (e) => {
      if (this.filterPanel && this.filterPanel.classList.contains("active")) {
        if (!this.filterPanel.contains(e.target) && !this.filterBtn.contains(e.target)) {
          this.closeFilterPanel()
        }
      }
    })

    // Close form when clicking outside
    if (this.formSection) {
      this.formSection.addEventListener("click", (e) => {
        if (e.target === this.formSection) {
          this.closeForm()
        }
      })
    }
  }

  /**
   * Handle search functionality
   * @param {string} query - Search query
   */
  handleSearch(query) {
    this.employeeManager.setSearchQuery(query)
    this.currentPage = 1
    this.renderEmployeeList()
  }

  /**
   * Handle sort functionality
   * @param {string} sortValue - Sort field
   */
  handleSort(sortValue) {
    if (sortValue) {
      // Toggle direction if same field is selected
      const currentSort = this.employeeManager.getCurrentSort()
      const direction = currentSort.field === sortValue && currentSort.direction === "asc" ? "desc" : "asc"

      this.employeeManager.setSorting(sortValue, direction)
    } else {
      this.employeeManager.clearSorting()
    }

    this.currentPage = 1
    this.renderEmployeeList()
  }

  /**
   * Toggle filter panel visibility
   */
  toggleFilterPanel() {
    if (this.filterPanel) {
      this.filterPanel.classList.toggle("active")
    }
  }

  /**
   * Close filter panel
   */
  closeFilterPanel() {
    if (this.filterPanel) {
      this.filterPanel.classList.remove("active")
    }
  }

  /**
   * Apply filters
   */
  applyFilters() {
    const filters = {
      firstName: document.getElementById("filter-firstName")?.value || "",
      department: document.getElementById("filter-department")?.value || "",
      role: document.getElementById("filter-role")?.value || "",
    }

    this.employeeManager.setFilters(filters)
    this.currentPage = 1
    this.renderEmployeeList()
    this.closeFilterPanel()
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    // Clear filter form
    document.getElementById("filter-firstName").value = ""
    document.getElementById("filter-department").value = ""
    document.getElementById("filter-role").value = ""

    // Clear employee manager filters
    this.employeeManager.clearFilters()
    this.currentPage = 1
    this.renderEmployeeList()
  }

  /**
   * Show add employee form
   */
  showAddForm() {
    this.isEditMode = false
    this.editingEmployeeId = null
    this.formTitle.textContent = "Add Employee"
    this.clearForm()
    Validation.clearErrors()
    this.formSection.classList.add("active")

    // Focus on first field
    setTimeout(() => {
      document.getElementById("firstName")?.focus()
    }, 100)
  }

  /**
   * Show edit employee form
   * @param {number} employeeId - Employee ID to edit
   */
  showEditForm(employeeId) {
    const employee = this.employeeManager.getEmployeeById(employeeId)
    if (!employee) {
      Utils.showError("Employee not found")
      return
    }

    this.isEditMode = true
    this.editingEmployeeId = employeeId
    this.formTitle.textContent = "Edit Employee"
    this.populateForm(employee)
    Validation.clearErrors()
    this.formSection.classList.add("active")

    // Focus on first field
    setTimeout(() => {
      document.getElementById("firstName")?.focus()
    }, 100)
  }

  /**
   * Close form
   */
  closeForm() {
    this.formSection.classList.remove("active")
    this.clearForm()
    Validation.clearErrors()
    this.isEditMode = false
    this.editingEmployeeId = null
  }

  /**
   * Clear form fields
   */
  clearForm() {
    if (this.employeeForm) {
      this.employeeForm.reset()
    }
  }

  /**
   * Populate form with employee data
   * @param {Object} employee - Employee data
   */
  populateForm(employee) {
    document.getElementById("firstName").value = employee.firstName || ""
    document.getElementById("lastName").value = employee.lastName || ""
    document.getElementById("email").value = employee.email || ""
    document.getElementById("department").value = employee.department || ""
    document.getElementById("role").value = employee.role || ""
  }

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  handleFormSubmit(e) {
    e.preventDefault()

    // Get form data
    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      department: document.getElementById("department").value,
      role: document.getElementById("role").value,
    }

    let result

    if (this.isEditMode) {
      result = this.employeeManager.updateEmployee(this.editingEmployeeId, formData)
    } else {
      result = this.employeeManager.addEmployee(formData)
    }

    if (result.success) {
      Utils.showSuccess(result.message)
      this.closeForm()
      this.renderEmployeeList()
    } else {
      if (result.errors) {
        Validation.displayErrors(result.errors)
      } else {
        Utils.showError(result.message)
      }
    }
  }

  /**
   * Handle employee deletion
   * @param {number} employeeId - Employee ID to delete
   */
  handleDelete(employeeId) {
    const employee = this.employeeManager.getEmployeeById(employeeId)
    if (!employee) {
      Utils.showError("Employee not found")
      return
    }

    const confirmMessage = `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
    if (Utils.confirm(confirmMessage)) {
      const result = this.employeeManager.deleteEmployee(employeeId)

      if (result.success) {
        Utils.showSuccess(result.message)
        this.renderEmployeeList()
      } else {
        Utils.showError(result.message)
      }
    }
  }

  /**
   * Go to previous page
   */
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--
      this.renderEmployeeList()
    }
  }

  /**
   * Go to next page
   */
  goToNextPage() {
    const employees = this.employeeManager.getProcessedEmployees()
    const totalPages = Math.ceil(employees.length / this.itemsPerPage)

    if (this.currentPage < totalPages) {
      this.currentPage++
      this.renderEmployeeList()
    }
  }

  /**
   * Go to specific page
   * @param {number} page - Page number
   */
  goToPage(page) {
    const employees = this.employeeManager.getProcessedEmployees()
    const totalPages = Math.ceil(employees.length / this.itemsPerPage)

    if (page >= 1 && page <= totalPages) {
      this.currentPage = page
      this.renderEmployeeList()
    }
  }

  /**
   * Render employee list
   */
  renderEmployeeList() {
    const employees = this.employeeManager.getProcessedEmployees()
    const paginationResult = Utils.paginate(employees, this.currentPage, this.itemsPerPage)

    this.renderEmployeeCards(paginationResult.items)
    this.renderPagination(paginationResult)
  }

  /**
   * Render employee cards
   * @param {Array} employees - Array of employees to render
   */
  renderEmployeeCards(employees) {
    if (!this.employeeListContainer) return

    if (employees.length === 0) {
      this.employeeListContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No employees found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `
      return
    }

    const employeeCards = employees
      .map(
        (employee) => `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="employee-card__header">
                    <h3 class="employee-card__name">${Utils.sanitizeHtml(employee.firstName)} ${Utils.sanitizeHtml(employee.lastName)}</h3>
                    <span class="employee-card__id">ID: ${employee.id}</span>
                </div>
                
                <div class="employee-card__info">
                    <p class="employee-card__email">
                        <span class="employee-card__label">Email:</span>
                        ${Utils.sanitizeHtml(employee.email)}
                    </p>
                    <p class="employee-card__department">
                        <span class="employee-card__label">Department:</span>
                        ${Utils.sanitizeHtml(employee.department)}
                    </p>
                    <p class="employee-card__role">
                        <span class="employee-card__label">Role:</span>
                        ${Utils.sanitizeHtml(employee.role)}
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

    this.employeeListContainer.innerHTML = employeeCards

    // Bind edit and delete buttons
    this.bindEmployeeCardEvents()
  }

  /**
   * Bind events for employee cards
   */
  bindEmployeeCardEvents() {
    // Edit buttons
    const editButtons = document.querySelectorAll(".edit-btn")
    editButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const employeeId = Number.parseInt(e.target.getAttribute("data-id"))
        this.showEditForm(employeeId)
      })
    })

    // Delete buttons
    const deleteButtons = document.querySelectorAll(".delete-btn")
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const employeeId = Number.parseInt(e.target.getAttribute("data-id"))
        this.handleDelete(employeeId)
      })
    })
  }

  /**
   * Render pagination controls
   * @param {Object} paginationResult - Pagination data
   */
  renderPagination(paginationResult) {
    // Update pagination info
    if (this.paginationInfo) {
      this.paginationInfo.textContent = `Showing ${paginationResult.startIndex}-${paginationResult.endIndex} of ${paginationResult.totalItems} employees`
    }

    // Update page numbers
    if (this.pageNumbers) {
      this.renderPageNumbers(paginationResult)
    }

    // Update navigation buttons
    if (this.prevPageBtn) {
      this.prevPageBtn.disabled = !paginationResult.hasPrevPage
    }

    if (this.nextPageBtn) {
      this.nextPageBtn.disabled = !paginationResult.hasNextPage
    }
  }

  /**
   * Render page numbers
   * @param {Object} paginationResult - Pagination data
   */
  renderPageNumbers(paginationResult) {
    const { currentPage, totalPages } = paginationResult
    const pageNumbers = []

    // Calculate page range to show
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)

    // Adjust range if we're near the beginning or end
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4)
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4)
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(1)
      if (startPage > 2) {
        pageNumbers.push("...")
      }
    }

    // Add page numbers in range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }
      pageNumbers.push(totalPages)
    }

    // Render page numbers
    const pageNumbersHtml = pageNumbers
      .map((pageNum) => {
        if (pageNum === "...") {
          return '<span class="pagination__ellipsis">...</span>'
        }

        const isActive = pageNum === currentPage
        return `
                <button class="pagination__number ${isActive ? "active" : ""}" 
                        data-page="${pageNum}" 
                        ${isActive ? "disabled" : ""}>
                    ${pageNum}
                </button>
            `
      })
      .join("")

    this.pageNumbers.innerHTML = pageNumbersHtml

    // Bind page number clicks
    const pageButtons = this.pageNumbers.querySelectorAll(".pagination__number:not([disabled])")
    pageButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const page = Number.parseInt(e.target.getAttribute("data-page"))
        this.goToPage(page)
      })
    })
  }

  /**
   * Initialize the UI
   */
  initialize() {
    this.renderEmployeeList()
  }
}

// Make UIController available globally
window.UIController = UIController
