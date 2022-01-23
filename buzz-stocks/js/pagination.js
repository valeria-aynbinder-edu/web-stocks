

let  apiData = await fetchData()
let paginationMngr = {}


function pagination(req) {
    paginationMngr.table = req.data
    paginationMngr.total = req.pagination.total,
    paginationMngr.offset = (paginationMngr.page - 1) * paginationMngr.limit 
    paginationMngr.totalPages = Math.round(paginationMngr.total / paginationMngr.limit) //Number of available pages
}

async function fetchData(path='..\\data\\config.json'){
    try {
        
        let response = await fetch (path)
        let apiData = await response.json()
        return apiData

    } catch(err){
        // UI.showAlert('danger')
        console.log('Error getting json data')

    }
}

async function fetchApi(url){
    
    try {
        let response = await fetch (url)
        let stockData = await response.json()
        console.log(stockData)
        return stockData


    } catch(err){
        // UI.showAlert('danger')
        console.log('Error with api request')

    }
}

function pageButtons() {
    // Accessing the empty div on the html
    let wrapper = document.querySelector('#pagination-wrapper')

    // Chacking mi & max range of buttons
    let maxLeft = (paginationMngr.page - Math.floor(paginationMngr.window / 2))
    let maxRight = (paginationMngr.page + Math.floor(paginationMngr.window / 2))

    // Change if left button value is negative
    if (maxLeft < 1) {
        maxLeft = 1
        maxRight = paginationMngr.window
    }

    // Change if right button value is higher then button range
    if (maxRight > paginationMngr.totalPages) {
        maxLeft = paginationMngr.totalPages - (paginationMngr.window - 1)
        
        if (maxLeft < 1){
            maxLeft = 1
        }
        maxRight = paginationMngr.totalPages
    }
    
     // Clear old data (No stack up on second call) 
     wrapper.innerHTML = ``

    // Creating Buttons
    for (let page = maxLeft; page <= maxRight; page++) {
        if (page == paginationMngr.page){
            wrapper.innerHTML += `<button value=${page} class="page btn btn-md btn-primary p-2">${page}</button>`
        } else {
            wrapper.innerHTML += `<button value=${page} class="page btn btn-md btn-light p-2">${page}</button>`
        }
    }

    // Creating 'Start' button if page showing is not 1
    if (paginationMngr.page != 1) {
        wrapper.innerHTML = `<button value=${1} class="page btn btn-md btn-light">&#171; First</button>` + wrapper.innerHTML
    }
    
    // Creating 'last' button if page showing is not equal to last page
    if (paginationMngr.page != paginationMngr.totalPages) {
        wrapper.innerHTML += `<button value=${paginationMngr.totalPages} class="page btn btn-md btn-light">Last &#187;</button>`
    }

  
}


async function buildTable() {
    var table = document.querySelector('#table-body')
    table.innerHTML = ''

    // Getting data from web
    let params = {'access_key': apiData.api,'symbols': paginationMngr.symbol,'date_from':paginationMngr.start, 'date_to': paginationMngr.end, 'limit': paginationMngr.limit, 'offset': paginationMngr.offset, 'interval':apiData.interval}
    let trimData = await fetchApi(apiData.url + new URLSearchParams(params))

    // calling the pagination func with the returned data
    pagination(trimData)
   
    // Filling the table
    for (let ticker of paginationMngr.table) {
        const row = document.createElement('tr')

        row.innerHTML = `
                <td>${ticker.date}</td>
                <td>${ticker.open}</td>
                <td>${ticker.close}</td>`
            table.appendChild(row)
    }
    
    // Creating the buttons 
    pageButtons()
}

// Initial details from the html form
function loadTable(e){
    e.preventDefault()
    paginationMngr = {
        'table': null, 
        'symbol': document.querySelector('#Symbol').value,
        'start': document.querySelector('#Date-from').value,
        'end': document.querySelector('#Date-to').value,
        'limit': 12,
        'total': null,
        'offset': 0,
        'totalPages': null,
        'window': 5,
        'page': 1
    }
    // Create table
    document.querySelector('#table-scroll').style.display = 'flex'
    buildTable()
}

// Listener of form submission 
let req = document.querySelector('#stock-form')
req.addEventListener('submit', loadTable)



// Listener for pagination bottom click
document.querySelector('#pagination-wrapper').addEventListener('click', (e) => {
    // Remove book from UI
    paginationMngr.page = Number(e.target.value)

    buildTable()
})
