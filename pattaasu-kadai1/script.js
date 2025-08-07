document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost/pattaasu-kadai/';
    let products = [];
    let billItems = [];
    let isBillFinalized = false;

    // --- Element Selections ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-section');
    const billingManagementView = document.getElementById('billing-management-view');
    const billingMainView = document.getElementById('billing-main-view');
    const newInvoiceCreator = document.getElementById('new-invoice-creator');
    const oldInvoicesList = document.getElementById('old-invoices-list');
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const oldInvoicesBtn = document.getElementById('old-invoices-btn');
    const backToBillingBtn = document.getElementById('back-to-billing-btn');
    const backToBillingFromOldBtn = document.getElementById('back-to-billing-from-old-btn');
    const productSearchInput = document.getElementById('product-search-input');
    const productSearchResults = document.getElementById('product-search-results');
    const invoiceItemsBody = document.getElementById('invoice-items-body');
    const billDiscountInput = document.getElementById('bill-discount-percent');
    const clearBillBtn = document.getElementById('clear-bill-btn');
    const finalizeBillBtn = document.getElementById('finalize-bill-btn');
    const invoiceActions = document.getElementById('invoice-actions');
    const finalizedActions = document.getElementById('finalized-actions');
    const editBillBtn = document.getElementById('edit-bill-btn');
    const shareBillBtn = document.getElementById('share-bill-btn');

    const fetchProductsFromServer = async () => {
        try {
            const response = await fetch(API_BASE_URL + 'fetch_products.php');
            products = await response.json();
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const initApp = async () => {
        await fetchProductsFromServer();
        switchView('enquiry-view');
    };

    const switchView = (viewId) => {
        views.forEach(v => v.classList.toggle('active', v.id === viewId));
        navLinks.forEach(l => {
            const targetView = { 'nav-enquiry': 'enquiry-view', 'nav-products': 'products-management-view', 'nav-billing': 'billing-management-view' }[l.id];
            l.classList.toggle('active', targetView === viewId);
        });

        if (viewId === 'billing-management-view') {
            showBillingMainView();
        }
    };

    const showBillingMainView = () => {
        billingMainView.classList.remove('hidden');
        newInvoiceCreator.classList.add('hidden');
        oldInvoicesList.classList.add('hidden');
    };

    const showNewInvoiceCreator = () => {
        billingMainView.classList.add('hidden');
        newInvoiceCreator.classList.remove('hidden');
        resetInvoice();
    };

    const showOldInvoices = () => {
        billingMainView.classList.add('hidden');
        oldInvoicesList.classList.remove('hidden');
    };
    
    // --- Invoice Logic ---
    const resetInvoice = () => {
        billItems = [];
        isBillFinalized = false;
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-number').value = '';
        billDiscountInput.value = '0.00';
        document.getElementById('bill-number').textContent = `INV-${Date.now()}`;
        document.getElementById('bill-date').textContent = new Date().toLocaleDateString('en-CA');
        renderBillItems();
        updateBillCalculations();
        toggleFinalize(false);
    };

    const renderProductSearchResults = (filteredProducts) => {
        productSearchResults.innerHTML = '';
        filteredProducts.forEach(p => {
            const item = document.createElement('div');
            item.className = 'search-item';
            item.textContent = `${p.name} (${p.tamilName})`;
            item.dataset.id = p.id;
            item.addEventListener('click', () => addProductToBill(p.id));
            productSearchResults.appendChild(item);
        });
    };

    productSearchInput.addEventListener('input', () => {
        const query = productSearchInput.value.toLowerCase();
        if (query.length < 2) {
            productSearchResults.innerHTML = '';
            return;
        }
        const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.tamilName.toLowerCase().includes(query) || String(p.id).includes(query));
        renderProductSearchResults(filtered);
    });

    const addProductToBill = (productId) => {
        const product = products.find(p => p.id == productId);
        if (product && !billItems.find(item => item.id === product.id)) {
            billItems.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.offerPrice),
                quantity: 1,
                total: parseFloat(product.offerPrice)
            });
            renderBillItems();
            updateBillCalculations();
            productSearchInput.value = '';
            productSearchResults.innerHTML = '';
        }
    };

    const renderBillItems = () => {
        invoiceItemsBody.innerHTML = '';
        billItems.forEach((item, index) => {
            const row = invoiceItemsBody.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td><input type="number" class="editable-input price-input" data-index="${index}" value="${item.price.toFixed(2)}" ${isBillFinalized ? 'disabled' : ''}></td>
                <td><input type="number" class="editable-input quantity-input" data-index="${index}" value="${item.quantity}" min="1" ${isBillFinalized ? 'disabled' : ''}></td>
                <td>₹${item.total.toFixed(2)}</td>
                <td><button class="delete-item-btn" data-index="${index}" ${isBillFinalized ? 'style="display:none;"' : ''}><i class="fas fa-trash-alt"></i></button></td>
            `;
        });
    };
    
    invoiceItemsBody.addEventListener('input', (e) => {
        if (e.target.classList.contains('editable-input')) {
            const index = e.target.dataset.index;
            const item = billItems[index];
            if (e.target.classList.contains('price-input')) {
                item.price = parseFloat(e.target.value) || 0;
            }
            if (e.target.classList.contains('quantity-input')) {
                item.quantity = parseInt(e.target.value) || 1;
            }
            item.total = item.price * item.quantity;
            updateBillCalculations();
            renderBillItems(); // To update the total column
        }
    });

    invoiceItemsBody.addEventListener('click', (e) => {
        if (e.target.closest('.delete-item-btn')) {
            billItems.splice(e.target.closest('.delete-item-btn').dataset.index, 1);
            renderBillItems();
            updateBillCalculations();
        }
    });

    const updateBillCalculations = () => {
        const subTotal = billItems.reduce((sum, item) => sum + item.total, 0);
        const discountPercent = parseFloat(billDiscountInput.value) || 0;
        const discountAmount = (subTotal * discountPercent) / 100;
        const total = subTotal - discountAmount;

        document.getElementById('bill-sub-total').textContent = `₹${subTotal.toFixed(2)}`;
        document.getElementById('bill-discount-amount').textContent = `₹${discountAmount.toFixed(2)}`;
        document.getElementById('bill-total').textContent = `₹${total.toFixed(2)}`;
    };

    const toggleFinalize = (isFinal) => {
        isBillFinalized = isFinal;
        document.getElementById('invoice-paper').classList.toggle('finalized', isFinal);
        document.querySelectorAll('.customer-details input, #bill-discount-percent').forEach(el => el.disabled = isFinal);
        invoiceActions.classList.toggle('hidden', isFinal);
        finalizedActions.classList.toggle('hidden', !isFinal);
        renderBillItems();
    };

    const saveBillToServer = async () => {
        // This function would send the bill data to a new PHP endpoint
        // that saves it to a `bills` table in the database.
        // For now, this is a placeholder.
        console.log("Saving bill to server...", {
            bill_number: document.getElementById('bill-number').textContent,
            customer_name: document.getElementById('customer-name').value,
            customer_phone: document.getElementById('customer-number').value,
            items: billItems,
            total: document.getElementById('bill-total').textContent
        });
        alert('Bill finalized and saved!');
    };
    
    // --- Event Listeners ---
    navLinks.forEach(l => l.addEventListener('click', () => switchView({ 'nav-enquiry': 'enquiry-view', 'nav-products': 'products-management-view', 'nav-billing': 'billing-management-view' }[l.id])));
    newInvoiceBtn.addEventListener('click', showNewInvoiceCreator);
    oldInvoicesBtn.addEventListener('click', showOldInvoices);
    backToBillingBtn.addEventListener('click', showBillingMainView);
    backToBillingFromOldBtn.addEventListener('click', showBillingMainView);
    billDiscountInput.addEventListener('input', updateBillCalculations);
    clearBillBtn.addEventListener('click', resetInvoice);
    
    finalizeBillBtn.addEventListener('click', () => {
        if (billItems.length === 0) {
            alert('Please add products to the bill.');
            return;
        }
        toggleFinalize(true);
        saveBillToServer();
    });

    editBillBtn.addEventListener('click', () => toggleFinalize(false));

    shareBillBtn.addEventListener('click', () => {
        // This would generate a unique link based on the saved bill ID
        const billLink = `${window.location.origin}/view_bill.php?bill_id=${document.getElementById('bill-number').textContent}`;
        navigator.clipboard.writeText(billLink).then(() => alert('Bill link copied to clipboard!'));
    });

    initApp();
});