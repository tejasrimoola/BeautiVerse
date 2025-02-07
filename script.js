document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const updateWishlistUI = () => {
        const wishlistContainer = document.getElementById("wishlist-items");
        if (!wishlistContainer) return;

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
        } else {
            wishlistContainer.innerHTML = wishlist.map((item) => `
                <div class="wishlist-item">
                    <img src="images/${item.imageSrc}" alt="${item.title}" width="100">
                    <p>${item.title}</p>
                    <span>₹${item.price}</span>
                    <button class="remove-btn" data-title="${item.title.trim()}">Remove</button>
                </div>
            `).join("");
        }

        document.querySelectorAll(".wishlist-item .remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                const title = this.getAttribute("data-title");
                wishlist = wishlist.filter(item => item.title.trim() !== title);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                updateWishlistUI();
            });
        });
    };

    if (window.location.pathname.includes("wishlist.html")) {
        updateWishlistUI();
    }

    const updateCartUI = () => {
        const cartContainer = document.getElementById("cart-items");
        const totalAmountContainer = document.getElementById("total-amount");
        const placeOrderBtn = document.getElementById("place-order");

        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalAmountContainer.textContent = "Total: ₹0";
            placeOrderBtn.style.display = "none";
        } else {
            cartContainer.innerHTML = cart.map((item) => `
                <div class="cart-item">
                    <img src="images/${item.imageSrc}" alt="${item.title}" width="100">
                    <p>${item.title}</p>
                    <span>₹${item.price}</span>
                    <button class="remove-btn" data-title="${item.title.trim()}">Remove</button>
                </div>
            `).join("");

            let totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price.replace("rs", "").trim()), 0);
            totalAmountContainer.textContent = `Total: ₹${totalPrice}`;
            placeOrderBtn.style.display = "block";

            placeOrderBtn.addEventListener("click", function () {
                localStorage.setItem("totalOrderAmount", totalPrice);
                window.location.href = "order.html";
            });

            document.querySelectorAll(".cart-item .remove-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const title = this.getAttribute("data-title");
                    cart = cart.filter(item => item.title.trim() !== title);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    updateCartUI();
                });
            });
        }
    };

    if (window.location.pathname.includes("cart.html")) {
        updateCartUI();
    }

    document.querySelectorAll(".new-product-box").forEach((box) => {
        const title = box.querySelector(".new-product-title").textContent.trim();
        const price = box.querySelector(".new-product-text span").textContent.trim();
        const imageSrc = box.querySelector(".new-product-img img").getAttribute("src").split('/').pop();
        const addToCartBtn = box.querySelector(".cart-btn");
        const wishlistBtn = box.querySelector(".wishlist-btn");

        if (cart.some(item => item.title === title)) {
            addToCartBtn.textContent = "Added to Cart";
            addToCartBtn.style.background = "green";
        }

        if (wishlist.some(item => item.title === title)) {
            wishlistBtn.classList.add("red-heart");
        }

        addToCartBtn.addEventListener("click", function () {
            if (!cart.some(item => item.title === title)) {
                cart.push({ title, price, imageSrc });
                localStorage.setItem("cart", JSON.stringify(cart));
                addToCartBtn.textContent = "Added to Cart";
                addToCartBtn.style.background = "green";
            } else {
                cart = cart.filter(item => item.title !== title);
                localStorage.setItem("cart", JSON.stringify(cart));
                addToCartBtn.textContent = "Add to Cart";
                addToCartBtn.style.background = "#d63384";
            }
            updateCartUI();
        });

        wishlistBtn.addEventListener("click", function () {
            wishlistBtn.classList.toggle("red-heart");
            if (wishlistBtn.classList.contains("red-heart")) {
                wishlist.push({ title, price, imageSrc });
            } else {
                wishlist = wishlist.filter(item => item.title !== title);
            }
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateWishlistUI();
        });
    });

    document.querySelector(".search-box button").addEventListener("click", function (event) {
        event.preventDefault();
        const query = document.querySelector(".search-box input").value.toLowerCase();
        const productBoxes = document.querySelectorAll(".new-product-box");
        const matchingProducts = Array.from(productBoxes).filter((box) => {
            const title = box.querySelector(".new-product-title").textContent.toLowerCase();
            return title.includes(query);
        });

        const productsContainer = document.querySelector(".new-product-container");
        productsContainer.innerHTML = "";

        if (matchingProducts.length > 0) {
            matchingProducts.forEach((product) => {
                productsContainer.appendChild(product);
            });
        } else {
            productsContainer.innerHTML = "<p>No products found matching your search.</p>";
        }
    });

    document.querySelectorAll(".new-p-heading li").forEach((category) => {
        category.addEventListener("click", function () {
            document.querySelectorAll(".new-p-heading li").forEach(li => li.classList.remove("active"));
            this.classList.add("active");

            const filter = this.getAttribute("data-filter").toLowerCase();
            const productBoxes = document.querySelectorAll(".new-product-box");

            productBoxes.forEach((box) => {
                const categorySpan = box.querySelector("span").textContent.trim().toLowerCase();
                if (filter === "all") {
                    box.style.display = "block";
                } else {
                    box.style.display = categorySpan.includes(filter) ? "block" : "none";
                }
            });
        });
    });
});
function startCountdown(duration) {
    let timer = duration, hours, minutes, seconds;
    setInterval(function () {
        hours = Math.floor(timer / 3600);
        minutes = Math.floor((timer % 3600) / 60);
        seconds = timer % 60;

        document.getElementById("countdown").textContent =
            `${hours}h ${minutes}m ${seconds}s`;

        if (--timer < 0) {
            document.getElementById("flash-sale").innerHTML = "<h2>Sale Ended!</h2>";
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
    startCountdown(3600);
});
document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    sendBtn.addEventListener("click", function () {
        const userMessage = chatInput.value.trim();
        if (userMessage !== "") {
            chatMessages.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
            chatInput.value = "";

            setTimeout(() => {
                chatMessages.innerHTML += `<p><strong>Bot:</strong> How can I help you?</p>`;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    // Function to update Recently Viewed UI
    function updateRecentlyViewedUI() {
        const recentlyViewedContainer = document.getElementById("recently-viewed-items");
        if (!recentlyViewedContainer) return;

        if (recentlyViewed.length === 0) {
            recentlyViewedContainer.innerHTML = "<p>No recently viewed products.</p>";
        } else {
            recentlyViewedContainer.innerHTML = recentlyViewed.map(item => `
                <div class="recent-item">
                    <img src="images/${item.imageSrc}" alt="${item.title}" width="100">
                    <p>${item.title}</p>
                    <span>₹${item.price}</span>
                </div>
            `).join("");
        }
    }

    // Function to add product to Recently Viewed
    function addToRecentlyViewed(title, price, imageSrc) {
        // Check if product already exists, if yes, remove old entry
        recentlyViewed = recentlyViewed.filter(item => item.title !== title);
        
        // Add new product at the beginning
        recentlyViewed.unshift({ title, price, imageSrc });

        // Limit to last 5 viewed products
        if (recentlyViewed.length > 5) {
            recentlyViewed.pop();
        }

        // Save to localStorage
        localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
        updateRecentlyViewedUI();
    }

    // Capture product clicks to add to Recently Viewed
    document.querySelectorAll(".new-product-box").forEach((box) => {
        box.addEventListener("click", function () {
            const title = box.querySelector(".new-product-title").textContent.trim();
            const price = box.querySelector(".new-product-text span").textContent.trim();
            const imageSrc = box.querySelector(".new-product-img img").getAttribute("src").split('/').pop();

            addToRecentlyViewed(title, price, imageSrc);
        });
    });

    // Load Recently Viewed items on page load
    updateRecentlyViewedUI();
});
// spinwheel
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const spinBtn = document.getElementById("spin-btn");
    const resultText = document.getElementById("spin-result");
    const backHomeBtn = document.getElementById("back-home");

    // Wheel Segments
    const segments = [
        "10% Cashback 🎉",
        "20% Off 🏷️",
        "Free Shipping 🚛",
        "50% Discount 💰",
        "Lucky Surprise 🎁",
        "Try Again 😔"
    ];

    const colors = ["#FF5733", "#FFC300", "#28A745", "#007BFF", "#D63384", "#6C757D"];
    let angle = 0;
    let spinning = false;
    let winningIndex = 0;

    // Draw Wheel
    function drawWheel(highlightIndex = -1) {
        const segmentAngle = (2 * Math.PI) / segments.length;
        for (let i = 0; i < segments.length; i++) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle + i * segmentAngle, angle + (i + 1) * segmentAngle);
            ctx.closePath();
            ctx.fillStyle = i === highlightIndex ? "#ffff00" : colors[i]; // Highlight the winning segment
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#fff";
            ctx.font = "14px Arial";
            ctx.fillText(segments[i], canvas.width / 2 + Math.cos(angle + i * segmentAngle + segmentAngle / 2) * 80 - 30, 
                canvas.height / 2 + Math.sin(angle + i * segmentAngle + segmentAngle / 2) * 80 + 5);
        }
    }
    drawWheel();

    // Spin Wheel
    spinBtn.addEventListener("click", function () {
        if (spinning) return;
        spinning = true;

        let rotations = Math.floor(Math.random() * 5) + 3;
        let spinAngle = rotations * 360 + Math.floor(Math.random() * 360);
        winningIndex = Math.floor(((spinAngle % 360) / 360) * segments.length);

        let start = null;
        function animateSpin(timestamp) {
            if (!start) start = timestamp;
            let progress = timestamp - start;
            let easedProgress = easeOut(progress / 3000) * spinAngle;

            angle = easedProgress * (Math.PI / 180);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWheel();

            if (progress < 3000) {
                requestAnimationFrame(animateSpin);
            } else {
                spinning = false;
                drawWheel(winningIndex);
                resultText.textContent = `🎉 Congratulations! You won: ${segments[winningIndex]} 🎉`;
                resultText.style.color = "green";

                // Show Back to Home Button
                backHomeBtn.style.display = "block";
            }
        }

        function easeOut(t) {
            return t * (2 - t);
        }

        requestAnimationFrame(animateSpin);
    });

    // Back to Home Functionality
    backHomeBtn.addEventListener("click", function () {
        window.location.href = "index.html";
    });
});
