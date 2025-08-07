document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost/pattaasu-kadai/';
    let products = [];
    let billItems = [];
    let idsToDelete = []; // PORULAI NEEKKA ITHAIP PAYANPADUTHTHAVUM

    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-section');
    const productList = document.getElementById('product-list');
    const adminTableBody = document.getElementById('admin-table-body');
    const addProductBtn = document.getElementById('add-product-btn');
    const saveToDbBtn = document.getElementById('save-to-db-btn');
    const productModal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const productForm = document.getElementById('product-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const oldInvoicesBtn = document.getElementById('old-invoices-btn');
    const newInvoiceCreator = document.getElementById('new-invoice-creator');
    const oldInvoicesList = document.getElementById('old-invoices-list');
    const productSelect = document.getElementById('product-select');
    const addToBillBtn = document.getElementById('add-to-bill-btn');
    const invoiceItemsBody = document.getElementById('invoice-items-body');
    const billDiscountInput = document.getElementById('bill-discount-percent');

    const saveProductsToLocalStorage = () => { localStorage.setItem('crackerProducts', JSON.stringify(products)); };

    const fetchProductsFromServer = async () => {
        try {
            const response = await fetch(API_BASE_URL + 'fetch_products.php');
            if (!response.ok) throw new Error(`Network response was not ok. Status: ${response.status}`);
            products = await response.json();
            saveProductsToLocalStorage();
        } catch (error) {
            console.error('Failed to fetch products:', error);
            productList.innerHTML = `<p style="color: red; text-align:center;">Failed to load products.</p>`;
        }
    };

    const initApp = async () => {
        const localProducts = localStorage.getItem('crackerProducts');
        if (localProducts) {
            products = JSON.parse(localProducts);
        } else {
            await fetchProductsFromServer();
        }
        // Also load pending deletions from local storage if needed
        idsToDelete = JSON.parse(localStorage.getItem('crackerDeletions')) || [];
        switchView('enquiry-view');
    };

    const renderEnquiryList = () => {
        productList.innerHTML = '';
        if (products.length === 0) {
            productList.innerHTML = `<p style="text-align: center;">No products available.</p>`;
            return;
        }
        const productsByCategory = products.reduce((acc, p) => { (acc[p.category] = acc[p.category] || []).push(p); return acc; }, {});
        Object.keys(productsByCategory).sort().forEach(category => {
            const container = document.createElement('div');
            container.innerHTML = `<h3 class="category-title">${category}</h3>`;
            const table = document.createElement('table');
            table.className = 'custom-table';
            table.innerHTML = `<thead><tr><th>English Name</th><th>Tamil Name</th><th>Original Price</th><th>Offer Price</th></tr></thead>`;
            const tbody = document.createElement('tbody');
            productsByCategory[category].forEach(product => {
                let indicator = '';
                if (product.priceHistory && product.priceHistory.length > 1) {
                    const current = product.priceHistory[product.priceHistory.length - 1];
                    const prev = product.priceHistory[product.priceHistory.length - 2];
                    if (current > prev) indicator = `<span class="price-increased">↑</span>`;
                    else if (current < prev) indicator = `<span class="price-decreased">↓</span>`;
                }
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${product.name}</td><td>${product.tamilName}</td>
                    <td class="price-original">₹${parseFloat(product.originalPrice).toFixed(2)}</td>
                    <td class="price-offer">₹${parseFloat(product.offerPrice).toFixed(2)} ${indicator}</td>
                `;
            });
            table.appendChild(tbody);
            const tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';
            tableContainer.appendChild(table);
            container.appendChild(tableContainer);
            productList.appendChild(container);
        });
    };

    const renderAdminTable = () => {
        adminTableBody.innerHTML = '';
        products.forEach(product => {
            const row = adminTableBody.insertRow();
            row.innerHTML = `
                <td>${product.id}</td><td>${product.name}</td><td>${product.tamilName}</td>
                <td>₹${parseFloat(product.originalPrice).toFixed(2)}</td>
                <td class="editable-price" data-id="${product.id}">₹${parseFloat(product.offerPrice).toFixed(2)}</td>
                <td>${product.category}</td>
                <td><button class="action-button delete-btn" data-id="${product.id}" style="color:var(--primary-color);background:none;border:none;cursor:pointer;">Delete</button></td>
            `;
        });
        document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDelete));
    };

    const switchView = (viewId) => {
        views.forEach(v => v.classList.toggle('active', v.id === viewId));
        navLinks.forEach(l => l.classList.toggle('active', { 'nav-enquiry': 'enquiry-view', 'nav-products': 'products-management-view', 'nav-billing': 'billing-management-view' }[l.id] === viewId));
        if (viewId === 'enquiry-view') renderEnquiryList();
        if (viewId === 'products-management-view') renderAdminTable();
        if (viewId === 'billing-management-view') {
            newInvoiceCreator.classList.add('hidden');
            oldInvoicesList.classList.add('hidden');
        }
    };

    navLinks.forEach(l => l.addEventListener('click', () => switchView({ 'nav-enquiry': 'enquiry-view', 'nav-products': 'products-management-view', 'nav-billing': 'billing-management-view' }[l.id])));

    const showModal = () => { productForm.reset(); modalTitle.textContent = 'Add New Product'; document.getElementById('product-id').value = ''; productModal.classList.remove('hidden'); };
    const hideModal = () => productModal.classList.add('hidden');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const offerPrice = parseFloat(document.getElementById('product-offer-price').value);
        products.push({
            id: newId,
            name: document.getElementById('product-name').value,
            tamilName: document.getElementById('product-tamil-name').value,
            originalPrice: parseFloat(document.getElementById('product-original-price').value),
            offerPrice: offerPrice,
            category: document.getElementById('product-category').value,
            priceHistory: [offerPrice]
        });
        saveProductsToLocalStorage();
        renderAdminTable();
        hideModal();
    };

    /**
     * ## MAATRAM SEIYAPATTA PAGUTHI ##
     * Porulai delete seiyum podhu, adhan ID ippozhudhu 'idsToDelete' array-il serkkappadum.
     */
    const handleDelete = (e) => {
        const id = parseInt(e.target.dataset.id, 10);
        if (confirm('Indha porulai neekka venduma? Urudhi seiya "Save to DB" button-ai click seiyavum.')) {
            // Add the ID to the list of items to be deleted on the server
            if (!idsToDelete.includes(id)) {
                idsToDelete.push(id);
            }
            // Remove the product from the local array to update the UI
            products = products.filter(p => p.id !== id);
            
            // Save both updated lists to local storage
            saveProductsToLocalStorage();
            localStorage.setItem('crackerDeletions', JSON.stringify(idsToDelete));
            
            renderAdminTable();
        }
    };

    const handlePriceEdit = (e) => {
        const cell = e.target.closest('.editable-price');
        if (!cell || cell.querySelector('input')) return;

        const currentText = cell.textContent;
        const currentPrice = parseFloat(currentText.replace('₹', ''));
        const productId = parseInt(cell.dataset.id, 10);

        cell.innerHTML = `<input type="number" value="${currentPrice}" class="editable-price-input" step="0.01" min="0">`;
        const input = cell.querySelector('input');
        input.focus();
        input.select();

        const finishEditing = () => {
            const newValue = parseFloat(input.value);

            if (!isNaN(newValue) && newValue > 0 && newValue !== currentPrice) {
                const pIndex = products.findIndex(p => p.id === productId);
                if (pIndex > -1) {
                    const oldProduct = products[pIndex];
                    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

                    const newProduct = {
                        ...oldProduct,
                        id: newId,
                        offerPrice: newValue,
                        priceHistory: [newValue]
                    };
                    
                    // Edit seiyum podhu, palaiya pathivai UI-il irundhu neekki, pudhiyadhai serkirom.
                    // Aanal 'idsToDelete' array-il serkkapadadha karanathal, database-il palaiya pathivu neekkapadadhu.
                    products.splice(pIndex, 1, newProduct);

                    saveProductsToLocalStorage();
                    renderAdminTable();
                }
            } else {
                cell.textContent = currentText;
            }
        };

        input.addEventListener('blur', finishEditing);
        input.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter') {
                input.blur();
            } else if (evt.key === 'Escape') {
                input.value = currentPrice;
                input.blur();
            }
        });
    };

    /**
     * ## MAATRAM SEIYAPATTA PAGUTHI ##
     * Ippozhudhu, server-ukku product array-udan, neekkavendiya IDs-um anuppappadum.
     */
    const saveProductsToServer = async () => {
        saveToDbBtn.textContent = 'Saving...';
        saveToDbBtn.disabled = true;
        try {
            // Create a payload that includes products to update/insert and IDs to delete
            const payload = {
                products: products,
                toDelete: idsToDelete
            };
            
            const response = await fetch(API_BASE_URL + 'save_products.php', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            
            const result = await response.json();
            
            if (response.ok && result.status === 'success') {
                alert('Success! ' + result.message);
                // Clear the deletion list after successful sync
                idsToDelete = [];
                localStorage.removeItem('crackerDeletions');
            } else { 
                throw new Error(result.message || 'Unknown error.'); 
            }
        } catch (error) {
            alert('Error saving to database: ' + error.message);
        } finally {
            saveToDbBtn.textContent = 'Save Changes to DB';
            saveToDbBtn.disabled = false;
        }
    };
    
    // --- Billing Logic ---
    const populateProductSelect = () => { productSelect.innerHTML = '<option value="">Select a product...</option>'; products.forEach(p => { const option = document.createElement('option'); option.value = p.id; option.textContent = `${p.name} (${p.tamilName})`; productSelect.appendChild(option); }); };
    const updateBillCalculations = () => { let subTotal = billItems.reduce((sum, item) => sum + item.amount, 0); let discountPercent = parseFloat(billDiscountInput.value) || 0; let discountAmount = (subTotal * discountPercent) / 100; let total = subTotal - discountAmount; document.getElementById('bill-product-count').textContent = billItems.length; document.getElementById('bill-product-quantity').textContent = billItems.reduce((sum, item) => sum + item.quantity, 0); document.getElementById('bill-sub-total').textContent = `₹${subTotal.toFixed(2)}`; document.getElementById('bill-discount-amount').textContent = `₹${discountAmount.toFixed(2)}`; document.getElementById('bill-total').textContent = `₹${total.toFixed(2)}`; };
    const renderBillItems = () => { invoiceItemsBody.innerHTML = ''; billItems.forEach((item, index) => { const row = invoiceItemsBody.insertRow(); row.innerHTML = `<td>${item.id}</td><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.price.toFixed(2)}</td><td>₹${item.amount.toFixed(2)}</td><td><button class="remove-item-btn" data-index="${index}" style="color:red;background:none;border:none;cursor:pointer;">X</button></td>`; }); document.querySelectorAll('.remove-item-btn').forEach(btn => btn.addEventListener('click', (e) => { billItems.splice(e.target.dataset.index, 1); renderBillItems(); updateBillCalculations(); })); };
    addToBillBtn.addEventListener('click', () => { const pId = productSelect.value; const qty = parseInt(document.getElementById('product-quantity').value); if (!pId || isNaN(qty) || qty < 1) { alert('Select product and quantity.'); return; } const product = products.find(p => p.id == pId); billItems.push({ id: product.id, name: product.name, quantity: qty, price: product.offerPrice, amount: product.offerPrice * qty }); renderBillItems(); updateBillCalculations(); productSelect.value = ''; document.getElementById('product-quantity').value = 1; });
    newInvoiceBtn.addEventListener('click', () => { newInvoiceCreator.classList.remove('hidden'); oldInvoicesList.classList.add('hidden'); populateProductSelect(); });
    oldInvoicesBtn.addEventListener('click', () => { newInvoiceCreator.classList.add('hidden'); oldInvoicesList.classList.remove('hidden'); });

    // --- Event Listeners ---
    addProductBtn.addEventListener('click', showModal);
    cancelBtn.addEventListener('click', hideModal);
    productForm.addEventListener('submit', handleFormSubmit);
    adminTableBody.addEventListener('dblclick', handlePriceEdit);
    saveToDbBtn.addEventListener('click', saveProductsToServer);
    billDiscountInput.addEventListener('input', updateBillCalculations);

    initApp();
});