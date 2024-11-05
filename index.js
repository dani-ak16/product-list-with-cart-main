// import data from "./data.json" with { type: 'json'}

const cardContainer = document.getElementById("card-container")
const cartQuantity = document.getElementById("cart-quantity")
const currentQuantity = document.getElementsByClassName("current-quantity")
const decrementBtn = document.getElementsByClassName("decrement-btn")
const incrementBtn = document.getElementsByClassName("increment-btn")
const orderDetails = document.getElementById("order-details")
const orderTotal = document.getElementsByClassName("order-total")
const emptyCartCard = document.querySelector(".empty-cart-card")
const orderDetailsContainer = document.querySelector(".order-details-container")
const confirmationCard = document.querySelector(".confirmation-card")
const confirmationCardDetails = document.querySelector(".confirmation-card-details")
const overlay = document.getElementById("overlay")
const confirmOrder = document.querySelector(".confirm-order")
const newOrder = document.querySelector(".start-new-order")
const body = document.body

let cartCount = 0
let itemCountList = []
cartQuantity.innerText = cartCount
let cards = ''
let itemTotal
let orderTotalPrice = 0

let imgSrc


function getImageForScreenSize(images) {
    const screenWidth = window.innerWidth;  
    if (screenWidth >= 1024) {
        return images.desktop;
    } else if (screenWidth >= 768) {
        return images.tablet;
    } else {
        return images.mobile;
    }
}

// Fetch the JSON data and then render the page
fetch('./data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Convert response to JSON
  })
  .then(data => {
    // Pass the fetched data to the render function
    render(data);
  })
  .catch(error => console.error('Error loading JSON data:', error));

// Render function that accepts data as a parameter
const render = (data) => {
  let cards = '';
  
  for (let i = 0; i < data.length; i++) {
    const imgSrc = getImageForScreenSize(data[i].image); // Get image based on screen size

    // Generate HTML for each product
    cards += `
      <div class="product-card flex-column">
          <div class="img-container" id="img-container">
              <img src="${imgSrc}" alt=""/>
              
              <button class="add-to-cart" id="product-${i}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z"/></clipPath></defs></svg>
                  <p>Add to Cart</p>
              </button>

              <div class="active-btn">
                  <button class="decrement-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path id="svg-btn" fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
                  </button>
                  <span class="current-quantity"></span>
                  <button class="increment-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path id="svg-btn" fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
                  </button>
              </div>
          </div>
          <div class="product-details" id="product-details">
              <p>${data[i].category}</p>
              <h3>${data[i].name}</h3>
              <span>$${data[i].price.toFixed(2)}</span>
          </div>
      </div>   
    `
    itemCountList.push([])
    ;
  }

  cardContainer.innerHTML = cards;

  const renderCart = () => {
    if (cartCount === 0){
        emptyCartCard.style.display  = "flex"
        orderDetailsContainer.style.display = "none"
    }else {
        emptyCartCard.style.display  = "none"
        orderDetailsContainer.style.display = "block"
    }
}

const addToCart = document.getElementsByClassName("add-to-cart")
const activeBtn = document.getElementsByClassName("active-btn")

for(let i = 0; i < addToCart.length; i++){
    
    addToCart[i].addEventListener("click", function(){
        cartCount += 1
        activeBtn[i].style.display = "flex"
        addToCart[i].style.display = "none"
        itemCountList[i].push("clicked")
        itemTotal = data[i].price * itemCountList[i].length
        orderTotalPrice += itemTotal
        for (let i = 0; i < orderTotal.length; i++) {
            orderTotal[i].innerText = orderTotalPrice.toFixed(2)
        }
        cartQuantity.innerText = cartCount
        currentQuantity[i].innerText = itemCountList[i].length
    
        orderDetails.innerHTML +=  `

        <div class="order-specifics" id="order-${i}">
                <div class="order-specifics-card">
                    <p id="item-name">${data[i].name}</p>
                    <div class="item-specifics">
                        <span class="item-specifics-item"><span class="item-quantity" id="item-${i}">${itemCountList[i].length}</span>x</span>
                        <p class="item-specifics-item">@<span id="item-price">$${data[i].price.toFixed(2)}</span></p>
                        <p id="item-total-price" class="item-specifics-item">$<span id="price-${i}">${itemTotal.toFixed(2)}</span></p>
                    </div>
                </div>

                <button class="remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path id="remove-btn" fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
                </button>
        </div>
        `
        confirmationCardDetails.innerHTML += `
            <div class="confirmation-card-specifics" id="confirmed-order-${i}">
                <img src=${data[i].image.thumbnail}>
                <div>
                    <p>${data[i].name}</p>
                    <div id="confirmation-specifics">
                        <span><span class="item-quantity" id="confirmed-item-${i}">${itemCountList[i].length}</span>x</span>
                        <p>@<span id="item-price">$${data[i].price.toFixed(2)}</span></p>
                    </div>
                    
                </div>
                <p class="item-specifics-item">$<span id="confirmed-price-${i}">${itemTotal.toFixed(2)}</span></p>
                
            </div>

        `
        renderCart()
    })
}

orderDetails.addEventListener("click", function(event) {
    if (event.target.closest(".remove-btn")) {
        const orderDiv = event.target.closest(".order-specifics")
        
        if (orderDiv) {
            const orderIndex = orderDiv.id.split("-")[1]
            const confirmedOrder = document.getElementById(`confirmed-order-${orderIndex}`)
            orderDiv.remove()
            confirmedOrder.remove()
            cartCount -= itemCountList[orderIndex].length
            cartQuantity.innerText = cartCount
            const itemCount = itemCountList[orderIndex].length
            itemTotal = data[orderIndex].price * itemCount
            orderTotalPrice -= itemTotal
            for (let i = 0; i < orderTotal.length; i++) {
                orderTotal[i].innerText = orderTotalPrice.toFixed(2)
            }
            itemCountList[orderIndex] = []
            addToCart[orderIndex].style.display = "flex"
            activeBtn[orderIndex].style.display = "none"
            renderCart()
        }
    }
})

for (let i = 0; i < incrementBtn.length; i++){
    incrementBtn[i].addEventListener("click", function(){
        const itemQuantity = document.getElementById(`item-${i}`)
        const itemTotalPrice = document.getElementById(`price-${i}`)
        const confirmedQuantity = document.getElementById(`confirmed-item-${i}`)
        const confirmedTotalPrice = document.getElementById(`confirmed-price-${i}`)
        itemCountList[i].push("clicked")
        cartCount += 1
        
        itemTotal = data[i].price * itemCountList[i].length
        cartQuantity.innerText = cartCount
        currentQuantity[i].innerText = itemCountList[i].length 
        itemQuantity.innerText = itemCountList[i].length
        itemTotalPrice.innerText = itemTotal.toFixed(2)
        confirmedQuantity.innerText = itemCountList[i].length
        confirmedTotalPrice.innerText = itemTotal.toFixed(2)
        orderTotalPrice += data[i].price
        for (let i = 0; i < orderTotal.length; i++) {
            orderTotal[i].innerText = orderTotalPrice.toFixed(2)
        }
        
        renderCart()
    })
}

for (let i = 0; i < decrementBtn.length; i++){
    
    decrementBtn[i].addEventListener("click", function(){
        const itemQuantity = document.getElementById(`item-${i}`)
        const itemTotalPrice = document.getElementById(`price-${i}`)
        const orderSpecifics = document.getElementById(`order-${i}`)
        const confirmedQuantity = document.getElementById(`confirmed-item-${i}`)
        const confirmedTotalPrice = document.getElementById(`confirmed-price-${i}`)
        const confirmedOrder = document.getElementById(`confirmed-order-${i}`)

        if (cartCount <= 0){
            cartQuantity.innerText = 0
            renderCart()
            return
        }else if ((itemCountList[i].length > 0) && (cartCount > 0) ){
            itemCountList[i].pop("clicked")
            cartCount -= 1
            cartQuantity.innerText = cartCount

            if (itemCountList[i].length === 0){
                addToCart[i].style.display = "flex"
                activeBtn[i].style.display = "none"
                orderSpecifics.remove()
                confirmedOrder.remove()
                orderTotalPrice -= data[i].price
                for (let i = 0; i < orderTotal.length; i++) {
                    orderTotal[i].innerText = orderTotalPrice.toFixed(2)
                }
                
                renderCart()
                return
            }else{
                currentQuantity[i].innerText = itemCountList[i].length
                itemQuantity.innerText = itemCountList[i].length
                confirmedQuantity.innerText = itemCountList[i].length
                itemTotal = data[i].price * itemCountList[i].length
                itemTotalPrice.innerText = itemTotal.toFixed(2)
                confirmedTotalPrice.innerText = itemTotal.toFixed(2)
                orderTotalPrice -= data[i].price
                for (let i = 0; i < orderTotal.length; i++) {
                    orderTotal[i].innerText = orderTotalPrice.toFixed(2)
                }
                
                renderCart()
                return
            }
            
        }else{
            cartCount -= 1
            cartQuantity.innerText = cartCount
            currentQuantity[i].innerText = itemCountList[i].length
            itemQuantity.innerText = itemCountList[i].length
            confirmedQuantity.innerText = itemCountList[i].length
            itemTotal = data[i].price * itemCountList[i].length
            itemTotalPrice.innerText = itemTotal.toFixed(2)
            confirmedTotalPrice.innerText = itemTotal.toFixed(2)
            orderTotalPrice -= data[i].price
            for (let i = 0; i < orderTotal.length; i++) {
                orderTotal[i].innerText = orderTotalPrice.toFixed(2)
            }
            
            renderCart()
        }
    })
}

confirmOrder.addEventListener("click", function(){
    body.classList.add("active-body")
    confirmationCard.classList.add("active")
    overlay.classList.add("active")
    
})

newOrder.addEventListener("click", function(){
    body.classList.remove("active-body")
    confirmationCard.classList.remove("active")
    overlay.classList.remove("active")
    cartCount = 0
    cartQuantity.innerText = cartCount
    orderTotalPrice = 0
    for (let i = 0; i < orderTotal.length; i++) {
        orderTotal[i].innerText = orderTotalPrice.toFixed(2)
    }
    orderDetails.innerHTML = ''
    confirmationCardDetails.innerHTML = ''

    for(let i = 0; i < addToCart.length; i++){
        itemCountList[i] = []
        addToCart[i].style.display = "flex"
        activeBtn[i].style.display = "none"
    }

    renderCart()
})
};








