const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionList = document.getElementById("transactionList");
const addBtn = document.getElementById("addBtn");
const filter = document.getElementById("filter");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const chartCanvas = document.getElementById("expenseChart");

const chart = new Chart(chartCanvas, {
    type: "pie",
    data: {
        labels: ["Income", "Expense"],
        datasets: [{
            data: [0, 0]
        }]
    }
});

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    balance.innerText = `₹${totalIncome - totalExpense}`;
    income.innerText = `₹${totalIncome}`;
    expense.innerText = `₹${totalExpense}`;

    chart.data.datasets[0].data = [totalIncome, totalExpense];
    chart.update();
}

function renderTransactions() {
    transactionList.innerHTML = "";

    const filterValue = filter.value;

    const filteredTransactions = transactions.filter(transaction => {
        if (filterValue === "all") return true;
        return transaction.type === filterValue;
    });
    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement("li");

        li.classList.add("transaction", transaction.type);

        li.innerHTML = `
            <div>
                <strong>${transaction.text}</strong>
                <p>₹${transaction.amount}</p>
            </div>
            <button class="delete-btn">Delete</button>
        `;

        li.querySelector("button").addEventListener("click", () => {
            transactions.splice(index, 1);
            saveData();
            renderTransactions();
            updateSummary();
        });

        transactionList.appendChild(li);
    });
}

addBtn.addEventListener("click", () => {
    const text = document.getElementById("text").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (text === "" || amount === 0) {
        alert("Please fill all fields");
        return;
    }

    transactions.push({
        text,
        amount,
        type
    });

    saveData();
    renderTransactions();
    updateSummary();

    document.getElementById("text").value = "";
    document.getElementById("amount").value = "";
});

filter.addEventListener("change", renderTransactions);

renderTransactions();
updateSummary();