document.addEventListener('DOMContentLoaded', function() {
    // --- Navigation Active Link Logic ---
    const currentPagePath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkFilename = linkHref.split('#')[0].split('/').pop();
        const currentFilename = currentPagePath.split('/').pop();

        // Special handling for the 'Contact' link which targets an ID on index.html
        if (linkHref.includes('#contact') && currentFilename === 'index.html') {
             link.classList.add('active-nav-link');
        } else if (linkFilename === currentFilename) {
            link.classList.add('active-nav-link');
        }
    });

    // --- Scroll Reveal Animation Logic ---
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal-text, .scroll-reveal-image');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Contact Form Handling with Flask Backend ---
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // STOP the default form submission

            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');

            // Basic Client-Side Validation
            if (!nameInput.value.trim()) {
                alert('Please enter your name.');
                return;
            }
            if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!messageInput.value.trim()) {
                alert('Please enter your message.');
                return;
            }

            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                timestamp: new Date().toISOString()
            };

            try {
                // Send data to your Flask backend
                const response = await fetch('/submit_contact', { // Target the Flask route
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData), // Send data as JSON
                });

                const result = await response.json(); // Parse the JSON response from Flask

                if (response.ok) { // Check if HTTP status is 2xx
                    alert(result.message);
                    contactForm.reset(); // Clear the form

                    // Redirect to index.html after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    // Handle server errors or validation errors from Flask
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Network error or server unreachable:', error);
                alert('Could not submit message. Please try again later.');
            }
        });
    }

    // --- Dynamic Products Page Logic (if on products.html) ---
    const productsContainer = document.getElementById('products-container');
    const productModal = document.getElementById('product-modal');
    const closeModalButton = document.querySelector('.close-button');
    const modalProductImage = document.getElementById('modal-product-image');
    const modalProductTitle = document.getElementById('modal-product-title');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductFeatures = document.getElementById('modal-product-features');


    const products = [
        {
            id: 'classic-banana',
            name: 'Classic Banana Powder',
            weight: '500g',
            price: 499,
            image: 'https://m.media-amazon.com/images/I/71CLMQ+t0cL.jpg',
            description: 'Our original, pure banana powder. A staple for health enthusiasts, perfect for smoothies, baking, and natural sweetening. Rich in potassium, fiber, and essential minerals to support your daily energy and digestive health.',
            features: [
                '100% Pure Banana',
                'No Additives or Preservatives',
                'Rich in Potassium & Fiber',
                'Versatile Ingredient'
            ]
        },
        {
            id: 'organic-banana',
            name: 'Organic Banana Powder',
            weight: '500g',
            price: 599,
            image: 'https://www.shutterstock.com/image-photo/alternative-flour-homemade-green-banana-260nw-2109746231.jpg',
            description: 'Certified organic and sustainably sourced. This premium banana powder offers the same great taste and nutritional benefits as our classic, with the added assurance of eco-friendly farming practices. Good for you, good for the planet.',
            features: [
                'Certified Organic',
                'Sustainably Sourced',
                'Non-GMO',
                'Eco-Friendly'
            ]
        },
        {
            id: 'banana-protein',
            name: 'Banana Protein Blend',
            weight: '750g',
            price: 899,
            image: 'https://images-cdn.ubuy.co.in/64da5c1b92047b576f0d22af-body-fortress-super-advanced-whey.jpg',
            description: 'Elevate your fitness routine with our Banana Protein Blend. Made with pure banana powder and high-quality plant-based protein, it\'s designed for optimal muscle recovery, sustained energy, and a delicious taste. Ideal for post-workout shakes.',
            features: [
                'High Plant-Based Protein',
                'Supports Muscle Recovery',
                'Natural Energy Boost',
                'Delicious Taste'
            ]
        },
        {
            id: 'green-banana-flour',
            name: 'Green Banana Flour',
            weight: '1kg',
            price: 749,
            image: 'https://www.sattvicfoods.in/cdn/shop/articles/banana-flour-raw-green-bananas-white-background-prebiotic-food-gut-heal-generative-ai.jpg?v=1737358315&width=1100',
            description: 'A revolutionary gluten-free flour alternative rich in resistant starch. Perfect for healthy baking, thickening sauces, and adding a prebiotic boost to your meals. Promotes gut health and stable blood sugar levels.',
            features: [
                'Gluten-Free & Grain-Free',
                'High in Resistant Starch',
                'Prebiotic Benefits for Gut Health',
                'Versatile Baking Alternative'
            ]
        }
    ];

    function renderProducts() {
        if (!productsContainer) return;

        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card', 'scroll-reveal-item');
            productCard.dataset.productId = product.id;

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3 class="product-title" style="color: #bd7434;">${product.name} (${product.weight})</h3>
                <p class="product-description" style="color: #4B4B4B;">${product.description.substring(0, 100)}...</p>
                <div class="product-price" style="color: #db335d;">₹${product.price}</div>
                <button class="cta-button add-to-cart-btn">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);

            productCard.style.animationDelay = `${0.1 * index}s`;

            observer.observe(productCard);
        });

        attachProductCardListeners();
    }

    function attachProductCardListeners() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', function(event) {
                if (event.target.classList.contains('add-to-cart-btn')) {
                    alert(`Added ${card.querySelector('.product-title').textContent} to cart! (Placeholder)`);
                    return;
                }
                const productId = this.dataset.productId;
                const product = products.find(p => p.id === productId);
                if (product) {
                    showProductModal(product);
                }
            });
        });
    }

    function showProductModal(product) {
        modalProductImage.src = product.image;
        modalProductImage.alt = product.name;
        modalProductTitle.textContent = product.name + ' (' + product.weight + ')';
        modalProductDescription.textContent = product.description;
        modalProductPrice.textContent = `₹${product.price}`;

        // Ensure these lines for image and features are NOT touched as requested
        modalProductFeatures.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalProductFeatures.appendChild(li);
        });

        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideProductModal() {
        productModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', hideProductModal);
    }

    if (productModal) {
        window.addEventListener('click', function(event) {
            if (event.target === productModal) {
                hideProductModal();
            }
        });
    }

    renderProducts();
});