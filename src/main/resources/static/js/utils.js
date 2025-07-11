/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

const Utils = {
  /**
   * Generate a unique ID for new employees
   * @returns {number} Unique ID
   */
  generateId() {
    return Date.now() + Math.floor(Math.random() * 1000)
  },

  /**
   * Debounce function to limit the rate of function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  /**
   * Format text for display (capitalize first letter)
   * @param {string} text - Text to format
   * @returns {string} Formatted text
   */
  formatText(text) {
    if (!text) return ""
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  },

  /**
   * Sanitize HTML to prevent XSS attacks
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeHtml(str) {
    const temp = document.createElement("div")
    temp.textContent = str
    return temp.innerHTML
  },

  /**
   * Show loading overlay
   */
  showLoading() {
    const overlay = document.getElementById("loading-overlay")
    if (overlay) {
      overlay.classList.add("active")
    }
  },

  /**
   * Hide loading overlay
   */
  hideLoading() {
    const overlay = document.getElementById("loading-overlay")
    if (overlay) {
      overlay.classList.remove("active")
    }
  },

  /**
   * Show success message (simple implementation)
   * @param {string} message - Success message
   */
  showSuccess(message) {
    // Simple alert for now - could be enhanced with toast notifications
    alert(`Success: ${message}`)
  },

  /**
   * Show error message (simple implementation)
   * @param {string} message - Error message
   */
  showError(message) {
    // Simple alert for now - could be enhanced with toast notifications
    alert(`Error: ${message}`)
  },

  /**
   * Confirm action with user
   * @param {string} message - Confirmation message
   * @returns {boolean} User confirmation
   */
  confirm(message) {
    return confirm(message)
  },

  /**
   * Sort array of objects by property
   * @param {Array} array - Array to sort
   * @param {string} property - Property to sort by
   * @param {string} direction - 'asc' or 'desc'
   * @returns {Array} Sorted array
   */
  sortByProperty(array, property, direction = "asc") {
    return [...array].sort((a, b) => {
      const aVal = a[property]?.toString().toLowerCase() || ""
      const bVal = b[property]?.toString().toLowerCase() || ""

      if (direction === "asc") {
        return aVal.localeCompare(bVal)
      } else {
        return bVal.localeCompare(aVal)
      }
    })
  },

  /**
   * Filter array of objects by multiple criteria
   * @param {Array} array - Array to filter
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered array
   */
  filterArray(array, filters) {
    return array.filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key]
        if (!filterValue) return true // Skip empty filters

        const itemValue = item[key]?.toString().toLowerCase() || ""
        const searchValue = filterValue.toString().toLowerCase()

        return itemValue.includes(searchValue)
      })
    })
  },

  /**
   * Search array of objects by text across multiple properties
   * @param {Array} array - Array to search
   * @param {string} searchText - Text to search for
   * @param {Array} properties - Properties to search in
   * @returns {Array} Filtered array
   */
  searchArray(array, searchText, properties = []) {
    if (!searchText) return array

    const searchLower = searchText.toLowerCase()

    return array.filter((item) => {
      return properties.some((prop) => {
        const value = item[prop]?.toString().toLowerCase() || ""
        return value.includes(searchLower)
      })
    })
  },

  /**
   * Paginate array
   * @param {Array} array - Array to paginate
   * @param {number} page - Current page (1-based)
   * @param {number} itemsPerPage - Items per page
   * @returns {Object} Pagination result
   */
  paginate(array, page, itemsPerPage) {
    const totalItems = array.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const items = array.slice(startIndex, endIndex)

    return {
      items,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
    }
  },

  /**
   * Add CSS class with animation
   * @param {HTMLElement} element - Element to animate
   * @param {string} className - CSS class to add
   */
  addClassWithAnimation(element, className) {
    element.classList.add(className)
    element.classList.add("fade-in")

    setTimeout(() => {
      element.classList.remove("fade-in")
    }, 300)
  },

  /**
   * Remove CSS class with animation
   * @param {HTMLElement} element - Element to animate
   * @param {string} className - CSS class to remove
   * @param {Function} callback - Callback after animation
   */
  removeClassWithAnimation(element, className, callback) {
    element.classList.add("fade-out")

    setTimeout(() => {
      element.classList.remove(className, "fade-out")
      if (callback) callback()
    }, 300)
  },
}

// Make Utils available globally
window.Utils = Utils
