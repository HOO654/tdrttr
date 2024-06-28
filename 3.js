// script.js
const adminPassword = 'admin123'; // Replace with your desired admin password
const userPassword = 'user123'; // Replace with your desired user password
let isAdmin = false;

function showLogin() {
    document.getElementById('admin-login').style.display = 'flex';
}

function login() {
    const inputPassword = document.getElementById('admin-password').value;
    if (inputPassword === adminPassword) {
        isAdmin = true;
        proceedToTasksPage();
    } else if (inputPassword === userPassword) {
        isAdmin = false;
        proceedToTasksPage();
    } else {
        alert('Incorrect password');
    }
}

function proceedToTasksPage() {
    document.getElementById('admin-login').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.getElementById('tasks-page').style.display = 'block';
    generateTableRows();
}

const startDate = new Date('2024-06-25');
const endDate = new Date(startDate);
endDate.setMonth(startDate.getMonth() + 2);

function generateTableRows() {
    const tbody = document.getElementById('task-body');
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() === 2 || currentDate.getDay() === 6) { // Tuesdays and Saturdays
            const dateString = currentDate.toLocaleDateString('en-GB');
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = dateString;
            row.appendChild(dateCell);

            const linkCell = document.createElement('td');
            const linkInput = document.createElement('input');
            linkInput.type = 'url';
            linkInput.className = 'link-input';
            linkInput.dataset.date = currentDate.toISOString().split('T')[0];
            linkInput.onblur = () => saveData();
            linkCell.appendChild(linkInput);
            row.appendChild(linkCell);

            const percentageCell = document.createElement('td');
            const percentageInput = document.createElement('input');
            percentageInput.type = 'number';
            percentageInput.className = 'percentage-input';
            percentageInput.min = '0';
            percentageInput.max = '100';
            percentageInput.disabled = !isAdmin;
            percentageInput.oninput = () => updatePercentage(percentageInput);
            percentageInput.onblur = () => saveData();
            percentageCell.appendChild(percentageInput);
            row.appendChild(percentageCell);

            tbody.appendChild(row);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    loadData();
    checkLinks();
}

function updatePercentage(input) {
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
        input.classList.remove('green', 'red');
        input.classList.add(value >= 50 ? 'green' : 'red');
    }
    updateTotal();
}

function updateTotal() {
    const inputs = document.querySelectorAll('.percentage-input');
    let total = 0;
    let count = 0;
    inputs.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            total += value;
            count++;
        }
    });
    const average = count ? (total / count).toFixed(2) : 0;
    document.getElementById('total').innerText = `Total: ${average}%`;
}

function checkLinks() {
    const inputs = document.querySelectorAll('.link-input');
    inputs.forEach((input, index) => {
        if (index > 0) {
            const previousDate = new Date(inputs[index - 1].dataset.date);
            const currentDate = new Date(input.dataset.date);
            const today = new Date();
            if (currentDate <= today) {
                input.disabled = true;
            }
        }
    });
}

function saveData() {
    const data = [];
    const rows = document.querySelectorAll('#task-body tr');
    rows.forEach(row => {
        const date = row.cells[0].innerText;
        const link = row.cells[1].querySelector('input').value;
        const percentage = row.cells[2].querySelector('input').value;
        data.push({ date, link, percentage });
    });
    localStorage.setItem('tasksData', JSON.stringify(data));
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('tasksData')) || [];
    const rows = document.querySelectorAll('#task-body tr');
    rows.forEach((row, index) => {
        if (data[index]) {
            row.cells[1].querySelector('input').value = data[index].link;
            const percentageInput = row.cells[2].querySelector('input');
            percentageInput.value = data[index].percentage;
            updatePercentage(percentageInput);
        }
    });
    updateTotal();
}
