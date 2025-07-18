document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const allNavTriggers = document.querySelectorAll('.nav-trigger');
    const contentSections = document.querySelectorAll('.content-section');
    const desktopNavLinks = document.querySelectorAll('.desktop-nav-links .nav-link');
    const productsNavLink = document.getElementById('products-nav-link');

    // Mobile Navigation Elements
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileProductsToggle = document.getElementById('mobile-products-toggle');
    const mobileDropdownMenu = document.getElementById('mobile-dropdown-menu');

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');

    // Modal Elements
    const compareSizesModal = document.getElementById('compare-sizes-modal');
    const modalCloseButton = document.querySelector('#compare-sizes-modal .modal-close-button');

    // Product data setup
    const productData = {
        'product1': {
            images: [
                "https://placehold.co/600x800/27ae60/ffffff?text=Nature+Photo+1",
                "https://placehold.co/600x800/2980b9/ffffff?text=Nature+Photo+2",
                "https://placehold.co/600x800/c0392b/ffffff?text=Nature+Photo+3",
                "https://placehold.co/600x800/8e44ad/ffffff?text=Nature+Photo+4",
                "https://placehold.co/600x800/f39c12/ffffff?text=Nature+Photo+5"
            ],
            currentImageIndex: 0
        },
        'product2': {
            images: [
                "https://placehold.co/600x800/e74c3c/ffffff?text=Cityscape+1",
                "https://placehold.co/600x800/f39c12/ffffff?text=Cityscape+2",
                "https://placehold.co/600x800/7f8c8d/ffffff?text=Cityscape+3"
            ],
            currentImageIndex: 0
        },
        'product3': {
            images: [
                "https://placehold.co/600x800/2ecc71/ffffff?text=Portrait+1",
                "https://placehold.co/600x800/d35400/ffffff?text=Portrait+2",
                "https://placehold.co/600x800/34495e/ffffff?text=Portrait+3"
            ],
            currentImageIndex: 0
        }
    };

    // --- Functions ---

    const showSection = (targetId) => {
        const sectionId = targetId.substring(1);
        
        contentSections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('hidden');
                setTimeout(() => section.classList.add('fade-in-section'), 10);
            } else {
                section.classList.add('hidden');
                section.classList.remove('fade-in-section');
            }
        });
        
        updateActiveLinks(sectionId);
        window.scrollTo(0, 0);

        if (sectionId.startsWith('product')) {
            initializeProductPage(sectionId);
        }
    };

    const updateActiveLinks = (activeSectionId) => {
        desktopNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').substring(1) === activeSectionId) {
                link.classList.add('active');
            }
        });
        
        if (activeSectionId.startsWith('product')) {
            productsNavLink.classList.add('active');
        } else {
            productsNavLink.classList.remove('active');
        }
    };
    
    const toggleMobileNav = () => {
        mobileNavOverlay.classList.toggle('active');
        mobileMenuIcon.innerHTML = mobileNavOverlay.classList.contains('active') ? '&times;' : '&#9776;';
    };

    const initializeProductPage = (productId) => {
        const product = productData[productId];
        if (!product) return;

        // Extract product number (e.g., '1' from 'product1')
        const productNumber = productId.replace('product', '');

        // --- Select elements using the correct unique IDs ---
        const mainImageElement = document.getElementById(`main-product-image-p${productNumber}`);
        const prevButton = document.getElementById(`prev-image-button-p${productNumber}`);
        const nextButton = document.getElementById(`next-image-button-p${productNumber}`);
        
        const productSection = document.getElementById(productId);
        const currentPriceSpan = productSection.querySelector(`.current-price`);
        const originalPriceSpan = productSection.querySelector(`.original-price`);
        const discountInfoSpan = productSection.querySelector(`.discount-info`);

        const frameSizeOptions = productSection.querySelectorAll('.options-grid .option-button[data-price]');
        const compareSizesLink = document.getElementById(`compare-sizes-link-p${productNumber}`);

        // 1. Set up image gallery
        const updateImage = () => {
            if (mainImageElement) {
                mainImageElement.style.opacity = '0';
                setTimeout(() => {
                    mainImageElement.src = product.images[product.currentImageIndex];
                    mainImageElement.alt = `${productId} Photo ${product.currentImageIndex + 1}`;
                    mainImageElement.style.opacity = '1';
                }, 150);
            }
        };

        if(prevButton) {
            prevButton.onclick = () => {
                product.currentImageIndex = (product.currentImageIndex - 1 + product.images.length) % product.images.length;
                updateImage();
            };
        }
        
        if(nextButton) {
            nextButton.onclick = () => {
                product.currentImageIndex = (product.currentImageIndex + 1) % product.images.length;
                updateImage();
            };
        }
        updateImage(); // Set initial image

        // 2. Set up option selection and price update
        const handleOptionClick = (buttons, e) => {
            buttons.forEach(btn => btn.classList.remove('active'));
            const clickedButton = e.target.closest('.option-button');
            if(clickedButton) {
                clickedButton.classList.add('active');
                
                if (clickedButton.hasAttribute('data-price')) {
                    const newPrice = parseFloat(clickedButton.getAttribute('data-price'));
                    const newOriginalPrice = parseFloat(clickedButton.getAttribute('data-original-price'));
                    
                    currentPriceSpan.textContent = `₹${newPrice.toLocaleString('en-IN')}`;
                    originalPriceSpan.textContent = `₹${newOriginalPrice.toLocaleString('en-IN')}`;
                    
                    const savedAmount = newOriginalPrice - newPrice;
                    const discountPercentage = Math.round((savedAmount / newOriginalPrice) * 100);
                    discountInfoSpan.textContent = `Save ₹${savedAmount.toLocaleString('en-IN')} (${discountPercentage}% Off)`;
                }
            }
        };
        
        frameSizeOptions.forEach(button => {
            button.addEventListener('click', (e) => handleOptionClick(frameSizeOptions, e));
        });

        // 3. Set up Compare Sizes link
        if (compareSizesLink) {
            compareSizesLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(compareSizesModal);
            });
        }
    };

    const openModal = (modalElement) => {
        if(modalElement) {
            modalElement.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = (modalElement) => {
        if(modalElement) {
            modalElement.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // --- Event Listeners ---

    allNavTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('href');
            if (targetId) {
                showSection(targetId);
            }
            if (mobileNavOverlay.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });

    mobileMenuIcon.addEventListener('click', toggleMobileNav);
    
    mobileProductsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileDropdownMenu.classList.toggle('active');
    });

    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('visible', window.scrollY > 300);
    });

    if (compareSizesModal) {
        modalCloseButton.addEventListener('click', () => closeModal(compareSizesModal));
        window.addEventListener('click', (e) => {
            if (e.target === compareSizesModal) {
                closeModal(compareSizesModal);
            }
        });
    }

    // --- Initial State ---
    const initialHash = window.location.hash;
    if (initialHash && document.getElementById(initialHash.substring(1))) {
        showSection(initialHash);
    } else {
        showSection('#home');
    }
});