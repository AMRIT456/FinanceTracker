// let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
// let transactions = [];
const balanceAmount = document.getElementById("balanceAmount");
const transactionForm = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const typeSelect = document.getElementById("typeSelect");
const transactionList = document.getElementById("transactionList");
const noTransactionMessage = document.getElementById("noTransactionMessage");
let transactions = [];

// Check if transactions data exists in Local Storage
if (localStorage.getItem("transactions")) {
    transactions = JSON.parse(localStorage.getItem("transactions"));
}
// Function to update balance
function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => {
        return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
    balanceAmount.textContent = balance.toFixed(2);
}
// Function to add a transaction
function addTransaction(event) {
    event.preventDefault();

    const description = descriptionInput.value;
    const amount = +amountInput.value;
    const type = typeSelect.value;

    const transaction = {
        description,
        amount,
        type
    };

    transactions.push(transaction);
    updateTransactions();
    updateBalance();
    saveTransactions();

    descriptionInput.value = "";
    amountInput.value = "";
    typeSelect.value = "income";
}

// Function to delete a transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateTransactions();
    updateBalance();
    saveTransactions();
}

// Function to save transactions to Local Storage
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to load transactions from Local Storage
function loadTransactions() {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
        updateTransactions();
        updateBalance();
    }
}

// Function to update the transaction list
function updateTransactions() {
    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        noTransactionMessage.style.display = "block";
    } else {
        noTransactionMessage.style.display = "none";

        transactions.forEach((transaction, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${transaction.description}</span>
                <span class="${transaction.type}">${transaction.type === "income" ? "+" : "-"}${transaction.amount}</span>
                <div class="transaction-actions">
                    <button onclick="editTransaction(${index})">Edit</button>
                    <button onclick="deleteTransaction(${index})">Delete</button>
                </div>
            `;
            transactionList.appendChild(listItem);
        });
    }
}
// Function to edit a transaction
function editTransaction(index) {
    const transaction = transactions[index];
    const updatedDescription = prompt("Enter the updated description:", transaction.description);
    const updatedAmount = parseFloat(prompt("Enter the updated amount:", transaction.amount));
    const updatedType = prompt("Enter the updated type (income or expense):", transaction.type);

    if (updatedDescription && !isNaN(updatedAmount) && (updatedType === "income" || updatedType === "expense")) {
        transactions[index] = {
            description: updatedDescription,
            amount: updatedAmount,
            type: updatedType
        };

        updateTransactions();
        updateBalance();
        saveTransactions();
    } else {
        alert("Invalid input! Please try again.");
    }
}

// Event listener for adding a transaction
transactionForm.addEventListener("submit", addTransaction);

// Load transactions on page load
loadTransactions();
