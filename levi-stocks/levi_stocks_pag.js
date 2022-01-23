API_URL = "http://api.marketstack.com/v1/"
TICKER_URL = "http://api.marketstack.com/v1/tickers?access_key="
KEY = "" // enter your API key here
LIMIT = 25

// Example e- http://api.marketstack.com/v1/eod?access_key=bf236bb8e871081bd0d1b39946bf5fc1&symbols=AAPL

ticker_list = []


async function getTickerList(){
    // get the ticker data from API
    let response = await fetch(TICKER_URL+KEY);
    let massage = await response.json()
    console.log("you got massage",massage)

    // for each ticker create option for drop down menu - select & option
    for (index=0;index<massage.data.length;index++){
        curr_ticker = massage.data[index].symbol
        option = document.createElement("option")
        option.className = "dropdown-item"
        option.name = curr_ticker
        ticker_name = document.createTextNode(curr_ticker)
        option.appendChild(ticker_name)
        document.getElementById("ticker_dd").appendChild(option)
    }
}

function paginUrl(from,to,offset) {
    return `${API_URL}intraday?access_key=${KEY}&symbols=${ticker}&interval=24hour&date_from=${from}&date_to=${to}&offset=${offset}&limit=${LIMIT}`
}

function newPageMenu(offset,total_rec,limit_page){
    console.log("create new page button menu")

    // calculate total pages required:
    total_pages = Math.ceil(total_rec/limit_page)
    console.log("total pages to create -",total_pages)

    // get menu location on HTML:
    menu_location = document.getElementById("page_menu")

    // make button menu's div visilbe:
    menu_location.style.visibility = "visible"

    // reset and delete the menu inner if its exist:
    menu_location.innerHTML = ""

    // // create "presvious" button:
    prev_btn = document.createElement("button")
    btn_text = document.createTextNode("previous")
    prev_btn.id = "prev"
    prev_btn.style.visibility = "hidden"
    prev_btn.className = "btn btn-dark"
    prev_btn.addEventListener("click",getInfo);
    prev_btn.appendChild(btn_text)
    menu_location.appendChild(prev_btn)

    // create menu:
    for (index=1;index<=total_pages;index++) {
        page_btn = document.createElement("button")
        btn_text = document.createTextNode(index)
        page_btn.value = (index-1)*LIMIT
        page_btn.id = index
        page_btn.className = "btn btn-secondary"
        if (page_btn.value == offset) {
            page_btn.className = "btn btn-info"
        }
        page_btn.addEventListener("click",getInfo);
        page_btn.appendChild(btn_text)
        menu_location.appendChild(page_btn)
    }

    // create "next" button:
    next_btn = document.createElement("button")
    btn_text = document.createTextNode("Next")
    next_btn.value = offset+LIMIT
    next_btn.id = "next"
    next_btn.className = "btn btn-dark"
    next_btn.addEventListener("click",getInfo);
    next_btn.appendChild(btn_text)
    menu_location.appendChild(next_btn)
}

function updatePageMenu(offset,count,total){

    // display previous button:
    if (offset==0) {
        document.getElementById("prev").style.visibility = "hidden"
    }
    else{
        document.getElementById("prev").style.visibility = "visible"
    }

      // display next button:
      if ((count+offset)==total) {
        document.getElementById("next").style.visibility = "hidden"
    }
    else{
        document.getElementById("next").style.visibility = "visible"
    }

    // update the value for previous & next buttons:
    previous_value = offset - LIMIT
    next_value = offset + LIMIT
    console.log(`updating exist page button menu - previos value ${previous_value} next value - ${next_value}`)
    document.getElementById("prev").value = previous_value
    document.getElementById("next").value = next_value

    // reset the css ffor all other pages:
    last_page = document.getElementsByClassName("btn btn-info")
    last_page[0].className = "btn btn-secondary"

    // update the css class of the chosen page of result
    curr_page = (offset/LIMIT)+1
    document.getElementById(curr_page).className = "btn btn-info"
}

function displayResult(result_obj){

    console.log("creating table result")
    res_table = document.getElementById("res_table")

    // get pagination info from request
    offset = result_obj.pagination.offset
    total = result_obj.pagination.total
    limit = result_obj.pagination.limit
    count = result_obj.pagination.count

    // create pagination button menu: 
    // if request came from "GO" button: create new pagaination menu
    if (button_id == "go_button"){
        newPageMenu(offset,total,limit)
    }
    // else (request cae from exist pagiatio memu) - need to update previous & next buttons & class for chosen page
    else{
        updatePageMenu(offset,count,total)
    } 

    // clear result if exist:
    res_table.innerHTML = ""

    // make table result & pagination buttons visible:
    document.getElementById("table_div").style.visibility="visible"

    for (index=0;index<count;index++) {
        // get th info to implement:
        date_value = result_obj.data[index].date
        open_value = result_obj.data[index].open
        close_value = result_obj.data[index].close

        // format date string:
        date_value = date_value.slice(0,10)

        // create text values:
        record_num = offset+index+1
        num_text = document.createTextNode(record_num)
        date_text = document.createTextNode(date_value)
        open_text = document.createTextNode(open_value)
        close_text = document.createTextNode(close_value)

        // create the record elements:
        raw = document.createElement("tr")
        curr_num = document.createElement("td")
        date_res = document.createElement("td")
        open_res = document.createElement("td")
        close_res = document.createElement("td")

        // insert texts into elements:
        curr_num.appendChild(num_text)
        date_res.appendChild(date_text)
        open_res.appendChild(open_text)
        close_res.appendChild(close_text)

        // append fields into record's raw:
        raw.appendChild(curr_num)
        raw.appendChild(date_res)
        raw.appendChild(open_res)
        raw.appendChild(close_res)

        // append raw to the HTML table:
        res_table.appendChild(raw)
    }
}

async function sendPaginRequest(url,button_id) {
    response = await fetch(url);
    massage = await response.json()
    console.log(massage)
    displayResult(massage,button_id)
}

function getInfo(e) {
    ticker = document.getElementById("ticker_dd").value
    from_date = document.getElementById("from").value
    to_date = document.getElementById("to").value
    offset = e.target.value
    button_id = e.target.id
    console.log("request sent by pressinng",button_id)
    console.log("reqeusted offset from value",offset)
    console.log(`get info command for ${ticker} from ${from_date} to ${to_date} offset ${offset}`)
    reqUrl = paginUrl(from_date,to_date,offset)
    console.log(reqUrl)
    result = sendPaginRequest(reqUrl,button_id)

}

function displayAlert(text){
    document.getElementById("alert").innerHTML = text
    document.getElementById("alert").style.visibility = 'visible'
    document.getElementById("go_button").style.visibility = "hidden"
}

function checkInput(e) {
    document.getElementById("go_button").style.visibility = "visible"
    document.getElementById("alert").style.visibility = 'hidden'
    input = e.target.value
    var input_date = new Date(input)
    var today = new Date();

    // check if input is later then today:
    if (input_date > today) {
        console.log("error <= today")
        displayAlert("cant get a date later then today, please try again")
    }
    checkDates()
}

function checkDates(){
    from = document.getElementById("from").value
    to = document.getElementById("to").value
    var from_date = new Date(from)
    var to_date = new Date(to)

    console.log(to_date - from_date)
    // check if 2nd - 1st < 6 months:
    if ((to_date - from_date)/60/60/24/1000 > 6*30) {
        console.log("error- long then 6 month")
        displayAlert("period is longer then 6 month, please re-enter")
    }
     // check if 1st date <= 2nd date:
     if (from_date > to_date) {
        console.log("error- 1st date <= 2nd date")
        displayAlert("1st date is later then 2nd date, please re-enter")
    }
}
