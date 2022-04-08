const request = (url, func) => {
    const client = new XMLHttpRequest()
    client.onreadystatechange = func
    client.open("GET", url, true)
    return client.send()
}
const getPercentage = (val1, val2) => {
    return (100 * val1) / val2
}
const format = (text) => {
    return text.toLowerCase().replace(/ /g, "-").replace(/'/g, "")
}

// Scripts
const initialWealth = 5000000000000000
let wealth = initialWealth

const el = {}
el.items = document.querySelector(".items")
el.wealth = document.querySelector(".wealth")
el.percentage = document.getElementById("percentage")

el.wealth.innerText = `$${wealth.toLocaleString()}`

request("./items.json", function() {
    if (this.readyState === 4 && this.status === 200) {
        const json = JSON.parse(this.responseText)
        json.sort(function(a, b) {
            return a.price - b.price
        })
        
        let item, itemName, itemNames = [], itemNameID, itemImg, itemPrices = [], itemCount = [], itemStock = []
        for (let i = 0; i < json.length; i++) {
            item = json[i]
            itemNames.push(item.name)
            itemName = itemNames[i]
            itemNameID = format(itemName)
            itemImg = item.img
            itemPrices.push(item.price)
            itemStock.push(item.count)
            itemCount.push(0)

            el.items.innerHTML += `<div class="item">
                <img src="${itemImg}" class="image" />
                <div class="name">${itemName}</div>
                <div class="price">$${itemPrices[i].toLocaleString()}</div>
                <div class="count-container">
                    <button id="buy-${itemNameID}" class="buy-button">Buy</button>
                    <div id="count-${itemNameID}" class="item-count">${itemCount[i]}</div>
                    <button id="sell-${itemNameID}" class="sell-button">Sell</button>
                </div>
            </div>`
        }

        let item2
        for (let i = 0; i < json.length; i++) {
            item = el.items.querySelectorAll(".item")[i]

            document.getElementById(`buy-${format(itemNames[i])}`).onclick = function() {
                if (itemStock[i] !== null) {
                    if (itemCount[i] !== itemStock[i]) {
                        if (wealth >= itemPrices[i]) {
                            itemCount[i] += 1
                            wealth -= itemPrices[i]

                            document.getElementById(`count-${format(itemNames[i])}`).innerText = itemCount[i]
                            el.wealth.innerText = `$${wealth.toLocaleString()}`

                            if (wealth < itemPrices[i] || itemCount[i] === itemStock[i]) {
                                document.getElementById(`buy-${format(itemNames[i])}`).setAttribute("disabled", "")
                            }
                        }
                    }
                } else {
                    if (wealth >= itemPrices[i]) {
                        itemCount[i] += 1
                        wealth -= itemPrices[i]

                        document.getElementById(`count-${format(itemNames[i])}`).innerText = itemCount[i]
                        el.wealth.innerText = `$${wealth.toLocaleString()}`

                        if (wealth < itemPrices[i]) {
                            document.getElementById(`buy-${format(itemNames[i])}`).setAttribute("disabled", "")
                        }
                    }
                }
            }
            document.getElementById(`sell-${format(itemNames[i])}`).onclick = function() {
                if (itemCount[i] > 0) {
                    itemCount[i] -= 1
                    wealth += itemPrices[i]

                    document.getElementById(`count-${format(itemNames[i])}`).innerText = itemCount[i]
                    el.wealth.innerText = `$${wealth.toLocaleString()}`

                    if (wealth >= itemPrices[i] || itemCount[i] !== itemStock[i]) {
                        document.getElementById(`buy-${format(itemNames[i])}`).removeAttribute("disabled", "")
                    }
                }
            }
        }
    }
})