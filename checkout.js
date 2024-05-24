document.addEventListener('DOMContentLoaded', () => {
    let listCart = [];
    let products = []; // Assuming products will be fetched

    function checkCart(){
        if(localStorage.getItem('cart')){
            listCart = JSON.parse(localStorage.getItem('cart'));
        }
        // Fetch product details
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                addCartToHTML(); // Ensure HTML is updated after products are fetched
            });
    }

    checkCart();

    function addCartToHTML(){
        let listCartHTML = document.querySelector('.returnCart .list');
        listCartHTML.innerHTML = '';

        let totalQuantityHTML = document.querySelector('.totalQuantity');
        let totalPriceHTML = document.querySelector('.totalPrice');
        let totalQuantity = 0;
        let totalPrice = 0;

        if(listCart.length > 0){
            listCart.forEach(item => {
                let product = products.find(p => p.id == item.product_id); // Find the product details
                if(product){
                    let newCart = document.createElement('div');
                    newCart.classList.add('item');
                    newCart.innerHTML = 
                        `<img src="${product.image}">
                        <div class="info">
                            <div class="name">${product.name}</div>
                            <div class="price">₱${product.price}/1 product</div>
                        </div>
                        <div class="quantity">${item.quantity}</div>
                        <div class="returnPrice">₱${product.price * item.quantity}</div>`;
                    listCartHTML.appendChild(newCart);
                    totalQuantity += item.quantity;
                    totalPrice += (product.price * item.quantity);
                }
            });
        }
        totalQuantityHTML.innerText = totalQuantity;
        totalPriceHTML.innerText = '₱' + totalPrice;
    }

    const checkoutButton = document.getElementById("checkoutButton");
    checkoutButton.addEventListener("click", function() {
        const receipt = generateReceipt();
        alert(receipt);
    });

    const generateReceipt = () => {
        let receipt = "Receipt:\n\n";
        listCart.forEach(item => {
            let product = products.find(p => p.id == item.product_id); // Find the product details
            if(product){
                receipt += `${product.name} - Quantity: ${item.quantity}, Price: ₱${product.price * item.quantity}\n`;
            }
        });
        let total = listCart.reduce((acc, item) => {
            let product = products.find(p => p.id == item.product_id);
            return product ? acc + product.price * item.quantity : acc;
        }, 0);
        receipt += `\nTotal: ₱${total}`;
        return receipt;
    }
});
