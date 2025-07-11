<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Directory</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <div id="app">
        <!-- Header -->
        <header class="header">
            <div class="container">
                <h1>Employee Directory</h1>
                <button id="add-employee-btn" class="btn btn-primary">Add Employee</button>
            </div>
        </header>

        <!-- Main Dashboard -->
        <main class="main">
            <div class="container">
                <!-- Search and Filter Controls -->
                <div class="controls">
                    <div class="search-section">
                        <input type="text" id="search-input" placeholder="Search employees..." class="search-input">
                    </div>
                    
                    <div class="filter-section">
                        <button id="filter-btn" class="btn btn-secondary">Filter</button>
                        <select id="sort-select" class="sort-select">
                            <option value="">Sort by...</option>
                            <option value="firstName">First Name</option>
                            <option value="lastName">Last Name</option>
                            <option value="department">Department</option>
                        </select>
                    </div>
                </div>

                <!-- Filter Panel (Hidden by default) -->
                <div id="filter-panel" class="filter-panel hidden">
                    <h3>Filter Employees</h3>
                    <div class="filter-form">
                        <input type="text" id="filter-firstName" placeholder="First Name" class="filter-input">
                        <select id="filter-department" class="filter-select">
                            <option value="">All Departments</option>
                            <option value="HR">HR</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                        <select id="filter-role" class="filter-select">
                            <option value="">All Roles</option>
                            <option value="Manager">Manager</option>
                            <option value="Developer">Developer</option>
                            <option value="Analyst">Analyst</option>
                        </select>
                        <div class="filter-actions">
                            <button id="apply-filter-btn" class="btn btn-primary">Apply</button>
                            <button id="clear-filter-btn" class="btn btn-secondary">Clear</button>
                        </div>
                    </div>
                </div>

                <!-- Employee List Container -->
                <div id="employee-list-container" class="employee-grid">
                    <#assign employees = mockEmployeeList>
                    <#list employees as employee>
                        <div class="employee-card" data-employee-id="${employee.id}">
                            <h3>${employee.firstName} ${employee.lastName}</h3>
                            <p class="employee-id">ID: ${employee.id}</p>
                            <p><strong>Email:</strong> ${employee.email}</p>
                            <p><strong>Department:</strong> ${employee.department}</p>
                            <p><strong>Role:</strong> ${employee.role}</p>
                            <div class="employee-actions">
                                <button class="btn btn-primary edit-btn" data-id="${employee.id}">Edit</button>
                                <button class="btn btn-danger delete-btn" data-id="${employee.id}">Delete</button>
                            </div>
                        </div>
                    </#list>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <div class="pagination-info">
                        <select id="items-per-page" class="items-per-page">
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                        <span id="pagination-text" class="pagination-text"></span>
                    </div>
                    <div class="pagination-controls">
                        <button id="prev-btn" class="btn btn-secondary">Previous</button>
                        <div id="page-numbers" class="page-numbers"></div>
                        <button id="next-btn" class="btn btn-secondary">Next</button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Add/Edit Form Modal -->
        <div id="form-modal" class="modal hidden">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="form-title">Add Employee</h2>
                    <button id="close-modal" class="close-btn">&times;</button>
                </div>
                <form id="employee-form" class="employee-form">
                    <div class="form-group">
                        <label for="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required>
                        <span class="error-message" id="firstName-error"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required>
                        <span class="error-message" id="lastName-error"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required>
                        <span class="error-message" id="email-error"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="department">Department *</label>
                        <select id="department" name="department" required>
                            <option value="">Select Department</option>
                            <option value="HR">HR</option>
                            <option value="IT">IT</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                        <span class="error-message" id="department-error"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="role">Role *</label>
                        <select id="role" name="role" required>
                            <option value="">Select Role</option>
                            <option value="Manager">Manager</option>
                            <option value="Developer">Developer</option>
                            <option value="Analyst">Analyst</option>
                        </select>
                        <span class="error-message" id="role-error"></span>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Save Employee</button>
                        <button type="button" id="cancel-btn" class="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="/static/js/data.js"></script>
    <script src="/static/js/app.js"></script>
</body>
</html>
