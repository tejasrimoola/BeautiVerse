document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("order-items");
    const totalPriceSpan = document.getElementById("total-price");

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("place-order").disabled = true;
        return;
    }

    // Display Order Items
    let totalPrice = 0;
    orderItemsContainer.innerHTML = cart.map((item) => {
        totalPrice += parseInt(item.price.replace("rs", "").trim());
        return `
            <div class="order-item">
                <img src="images/${item.imageSrc}" alt="${item.title}">
                <p>${item.title}</p>
                <span>${item.price}</span>
            </div>
        `;
    }).join("");

    totalPriceSpan.textContent = totalPrice + " Rs";

    // Place Order Button
    document.getElementById("place-order").addEventListener("click", function () {
        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const paymentMethod = document.querySelector("input[name='payment']:checked").value;

        if (!name || !address || !phone) {
            alert("Please fill in all delivery details.");
            return;
        }

        alert(`Order Placed Successfully! 
        \nName: ${name} 
        \nAddress: ${address} 
        \nPhone: ${phone} 
        \nPayment Method: ${paymentMethod} 
        \nTotal: ${totalPrice} Rs`);

        // Clear cart after order placement
        localStorage.removeItem("cart");
        window.location.href = "index.html"; // Redirect to home page
    });
});
