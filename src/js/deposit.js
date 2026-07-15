// Format VND helper
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Set quick select deposit values
function setQuickAmount(value) {
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.value = value;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verify session
    const session = checkSession();
    if (!session) return; // checkSession will redirect

    const email = session.user.email;

    // 2. Load deposit balance
    loadDepositBalance(email);

    // 3. Handle deposit form submission
    document.getElementById('deposit-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const amountInput = document.getElementById('amount');
        const bankSelect = document.getElementById('bank-name');
        const accountInput = document.getElementById('account-number');

        if (!amountInput || !bankSelect || !accountInput) return;

        const amount = parseInt(amountInput.value);
        const accountNumber = accountInput.value.trim();

        if (isNaN(amount) || amount < 10000000) {
            alert("Số tiền nạp tối thiểu là 10.000.000 ₫!");
            return;
        }

        if (!accountNumber) {
            alert("Vui lòng nhập số tài khoản ngân hàng!");
            return;
        }

        // Get user from LocalDB
        const users = window.LocalDB.get('users');
        const currentUser = users.find(u => u.email === email);
        if (!currentUser) {
            alert("Không tìm thấy thông tin tài khoản người dùng!");
            return;
        }

        const newDeposit = (currentUser.deposit || 0) + amount;

        // Update LocalDB User (Always executes)
        window.LocalDB.update('users', currentUser.id, { deposit: newDeposit });

        // Sync with Firestore User (Fire and forget to avoid hanging offline)
        db.collection("users").doc(currentUser.id).update({
            deposit: newDeposit
        }).catch(error => {
            console.log("Offline mode: Bỏ qua đồng bộ Firestore.");
        });

        // Update UI & Alert
        loadDepositBalance(email);
        alert(`Nạp tiền thành công!\nĐã cộng thêm ${formatVND(amount)} vào ví của bạn.`);
        
        // Clear input fields
        amountInput.value = '';
        accountInput.value = '';
    });
});

// Display deposit balance
function loadDepositBalance(email) {
    const displayElement = document.getElementById('current-balance-display');
    if (!displayElement) return;

    const users = window.LocalDB.get('users');
    const currentUser = users.find(u => u.email === email);
    const balance = currentUser ? currentUser.deposit : 0;

    displayElement.textContent = formatVND(balance);
}
