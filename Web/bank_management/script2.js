// 1. DATABASE GIẢ LẬP (Sẽ lưu vào LocalStorage)
let financeData = JSON.parse(localStorage.getItem('tvtiendo_finance')) || {
    accounts: [
        { id: 'vcb', name: 'Vietcombank', no: 'TRANVOTIENDO', initialBalance: 0, class: 'card-vcb', icon: 'shield-check' },
        { id: 'tcb', name: 'Sacombank', no: '060945 *** 110', initialBalance: 0, class: 'card-tcb', icon: 'credit-card' },
        { id: 'mb', name: 'MB Bank', no: '094 **** 110', initialBalance: 0, class: 'card-mb', icon: 'landmark' }
    ],
    // transactions: [
    //     { id: 1, title: 'Nhận lương tháng 12', category: 'Thu nhập', date: '2024-12-25', amount: 35000000, type: 'in', bankId: 'vcb', status: 'done' },
    //     { id: 2, title: 'Thanh toán tiền điện', category: 'Hóa đơn', date: '2024-12-24', amount: -1250000, type: 'out', bankId: 'vcb', status: 'done' },
    //     { id: 3, title: 'Chuyển tiền ăn tối', category: 'Ăn uống', date: '2024-12-23', amount: -450000, type: 'out', bankId: 'tcb', status: 'pending' }
    // ]
};

// 2. KHỞI TẠO
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderUI();
});

// 3. HÀM RENDER DỮ LIỆU LÊN GIAO DIỆN
function renderUI() {
    saveToLocal();
    
    // Tính toán số dư hiện tại cho từng bank
    const accountsWithBalance = financeData.accounts.map(acc => {
        const transSum = financeData.transactions
            .filter(t => t.bankId === acc.id)
            .reduce((sum, t) => sum + t.amount, 0);
        return { ...acc, currentBalance: acc.initialBalance + transSum };
    });

    // Render Stats Row (Thống kê tổng)
    const totalBalance = accountsWithBalance.reduce((sum, acc) => sum + acc.currentBalance, 0);
    const incomeThisMonth = financeData.transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const expenseThisMonth = Math.abs(financeData.transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0));

    document.getElementById('stats-summary').innerHTML = `
        <div class="stat-box">
            <div class="stat-icon" style="background: #e7e7ff; color: var(--primary-color);"><i data-lucide="wallet"></i></div>
            <div><p style="color: var(--text-muted); font-size: 0.8rem;">Tổng số dư</p><h3 style="font-size: 1.4rem;">${formatMoney(totalBalance)}</h3></div>
        </div>
        <div class="stat-box">
            <div class="stat-icon" style="background: #e6faf5; color: var(--success-color);"><i data-lucide="trending-up"></i></div>
            <div><p style="color: var(--text-muted); font-size: 0.8rem;">Thu nhập</p><h3 style="font-size: 1.4rem;">+${formatMoney(incomeThisMonth)}</h3></div>
        </div>
        <div class="stat-box">
            <div class="stat-icon" style="background: #fff5f5; color: var(--danger-color);"><i data-lucide="trending-down"></i></div>
            <div><p style="color: var(--text-muted); font-size: 0.8rem;">Chi tiêu</p><h3 style="font-size: 1.4rem;">-${formatMoney(expenseThisMonth)}</h3></div>
        </div>
    `;

    // Render Bank Cards (Dashboard & Accounts Tab)
    const bankCardsHTML = accountsWithBalance.map(acc => `
        <div class="bank-card ${acc.class}">
            <div class="bank-name">${acc.name} <i data-lucide="${acc.icon}" size="20"></i></div>
            <div class="acc-number">${acc.no}</div>
            <div class="balance">${formatMoney(acc.currentBalance)}</div>
        </div>
    `).join('');
    
    document.getElementById('featured-accounts').innerHTML = bankCardsHTML.split('</div>').slice(0, 2).join('</div>') + '</div>'; // Lấy 2 cái đầu
    document.getElementById('all-accounts-list').innerHTML = bankCardsHTML;

    // Render Transactions (Recent & History)
    const tableBodyRecent = document.querySelector('#recent-transactions-table tbody');
    const tableBodyFull = document.querySelector('#full-history-table tbody');

    const transHTML = financeData.transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => `
        <tr>
            <td style="font-weight: 600;">${t.title}</td>
            <td><span class="category-tag">${t.category}</span></td>
            <td>${t.date}</td>
            <td><span class="${t.type === 'in' ? 'amount-in' : 'amount-out'}">${t.amount > 0 ? '+' : ''}${formatMoney(t.amount)}</span></td>
            <td><i data-lucide="${t.status === 'done' ? 'check-circle-2' : 'clock'}" size="16" style="color: ${t.status === 'done' ? 'var(--success-color)' : 'orange'}"></i></td>
        </tr>
    `).join('');

    tableBodyRecent.innerHTML = transHTML;
    tableBodyFull.innerHTML = financeData.transactions.map(t => `
        <tr>
            <td>${t.title}</td>
            <td>${financeData.accounts.find(a => a.id === t.bankId)?.name}</td>
            <td>${t.date}</td>
            <td><span class="${t.type === 'in' ? 'amount-in' : 'amount-out'}">${formatMoney(t.amount)}</span></td>
        </tr>
    `).join('');

    lucide.createIcons();
}

// 4. CÁC HÀM TIỆN ÍCH
function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function openTab(evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.querySelectorAll(".sidebar-item").forEach(i => i.classList.remove("active"));
    document.getElementById(tabName).classList.add("active");
    if(evt) evt.currentTarget.classList.add("active");
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function saveToLocal() {
    localStorage.setItem('tvtiendo_finance', JSON.stringify(financeData));
}

// 5. HÀM THÊM GIAO DỊCH (DATABASE UPDATE)
function addNewTransaction() {
    const title = prompt("Nhập nội dung giao dịch:");
    if (!title) return;
    const amount = parseInt(prompt("Nhập số tiền (VD: -50000 cho chi, 100000 cho thu):"));
    if (isNaN(amount)) return;
    
    const newTrans = {
        id: Date.now(),
        title: title,
        category: amount > 0 ? 'Thu nhập' : 'Chi tiêu',
        date: new Date().toISOString().split('T')[0],
        amount: amount,
        type: amount > 0 ? 'in' : 'out',
        bankId: 'vcb', // Mặc định vcb cho nhanh
        status: 'done'
    };

    financeData.transactions.unshift(newTrans);
    renderUI(); // Tự động tính lại số dư và vẽ lại giao diện
}