/**
 * Form Validation Module
 * Handles all form validation logic
 */

const Validation = {
  /**
   * Email validation regex
   */
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /**
   * Validate required field
   * @param {string} value - Field value
   * @returns {Object} Validation result
   */
  validateRequired(value) {
    const isValid = value && value.trim().length > 0
    return {
      isValid,
      message: isValid ? "" : "This field is required",
    }
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {Object} Validation result
   */
  validateEmail(email) {
    if (!email || email.trim().length === 0) {
      return {
        isValid: false,
        message: "Email is required",
      }
    }

    const isValid = this.emailRegex.test(email.trim())
    return {
      isValid,
      message: isValid ? "" : "Please enter a valid email address",
    }
  },

  /**
   * Validate name field
   * @param {string} name - Name to validate
   * @param {string} fieldName - Field name for error message
   * @returns {Object} Validation result
   */
  validateName(name, fieldName = "Name") {
    if (!name || name.trim().length === 0) {
      return {
        isValid: false,
        message: `${fieldName} is required`,
      }
    }

    if (name.trim().length < 2) {
      return {
        isValid: false,
        message: `${fieldName} must be at least 2 characters long`,
      }
    }

    if (name.trim().length > 50) {
      return {
        isValid: false,
        message: `${fieldName} must be less than 50 characters`,
      }
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/
    if (!nameRegex.test(name.trim())) {
      return {
        isValid: false,
        message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
      }
    }

    return {
      isValid: true,
      message: "",
    }
  },

  /**
   * Validate select field
   * @param {string} value - Selected value
   * @param {string} fieldName - Field name for error message
   * @returns {Object} Validation result
   */
  validateSelect(value, fieldName = "Field") {
    const isValid = value && value.trim().length > 0
    return {
      isValid,
      message: isValid ? "" : `Please select a ${fieldName.toLowerCase()}`,
    }
  },

  /**
   * Validate entire employee form
   * @param {Object} formData - Form data to validate
   * @returns {Object} Validation result with errors
   */
  validateEmployeeForm(formData) {
    const errors = {}
    let isValid = true

    // Validate first name
    const firstNameResult = this.validateName(formData.firstName, "First name")
    if (!firstNameResult.isValid) {
      errors.firstName = firstNameResult.message
      isValid = false
    }

    // Validate last name
    const lastNameResult = this.validateName(formData.lastName, "Last name")
    if (!lastNameResult.isValid) {
      errors.lastName = lastNameResult.message
      isValid = false
    }

    // Validate email
    const emailResult = this.validateEmail(formData.email)
    if (!emailResult.isValid) {
      errors.email = emailResult.message
      isValid = false
    }

    // Validate department
    const departmentResult = this.validateSelect(formData.department, "Department")
    if (!departmentResult.isValid) {
      errors.department = departmentResult.message
      isValid = false
    }

    // Validate role
    const roleResult = this.validateSelect(formData.role, "Role")
    if (!roleResult.isValid) {
      errors.role = roleResult.message
      isValid = false
    }

    return {
      isValid,
      errors,
    }
  },

  /**
   * Display validation errors in the form
   * @param {Object} errors - Validation errors
   */
  displayErrors(errors) {
    // Clear all existing errors first
    this.clearErrors()

    // Display new errors
    Object.keys(errors).forEach((fieldName) => {
      const errorElement = document.getElementById(`${fieldName}-error`)
      const inputElement = document.getElementById(fieldName)

      if (errorElement && inputElement) {
        errorElement.textContent = errors[fieldName]
        inputElement.classList.add("error")
      }
    })
  },

  /**
   * Clear all validation errors
   */
  clearErrors() {
    const errorElements = document.querySelectorAll(".error-message")
    const inputElements = document.querySelectorAll(".input.error, .select.error")

    errorElements.forEach((element) => {
      element.textContent = ""
    })

    inputElements.forEach((element) => {
      element.classList.remove("error")
    })
  },

  /**
   * Real-time validation for a single field
   * @param {string} fieldName - Field name
   * @param {string} value - Field value
   */
  validateField(fieldName, value) {
    let result

    switch (fieldName) {
      case "firstName":
        result = this.validateName(value, "First name")
        break
      case "lastName":
        result = this.validateName(value, "Last name")
        break
      case "email":
        result = this.validateEmail(value)
        break
      case "department":
        result = this.validateSelect(value, "Department")
        break
      case "role":
        result = this.validateSelect(value, "Role")
        break
      default:
        result = { isValid: true, message: "" }
    }

    // Display error for this field
    const errorElement = document.getElementById(`${fieldName}-error`)
    const inputElement = document.getElementById(fieldName)

    if (errorElement && inputElement) {
      errorElement.textContent = result.message

      if (result.isValid) {
        inputElement.classList.remove("error")
      } else {
        inputElement.classList.add("error")
      }
    }

    return result
  },
}

// Make Validation available globally
window.Validation = Validation
