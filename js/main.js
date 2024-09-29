let title       = document.querySelector("#title");
let price       = document.querySelector("#price");
let taxes       = document.querySelector("#taxes");

let advertising = document.querySelector("#ads");
let discount    = document.querySelector("#discount");
let total       = document.querySelector("#total");

let count    = document.querySelector("#count");
let category = document.querySelector("#type");
let submit   = document.querySelector("#submit");

let arrData = [];
let currentMood = 'create';
let tempIndex;


function totalPrice(){
    if(!isEmpty()){
        total.innerHTML = (+price.value - (+taxes.value + +advertising.value + +discount.value ));
    }
}

function clearInput(){
    title.value = '';
    price.value = '';
    taxes.value = '';
    advertising.value = '';
    discount.value = '';
    category.value = '';
    count.value = '';
}

function isEmpty(){
    if(title.value != '' & price.value !== '' & taxes.value !== '' & advertising.value !== '' & discount.value !== ''){
        return false;
    }else{
        return true;
    }
}

function checkLocalStorage(){
    let data = localStorage.getItem("creatingdata");
    data != null ? arrData = JSON.parse(data) : arrData = [];
}

checkLocalStorage();

function create(){
    submit.addEventListener("click",function(){
        if(!isEmpty()){
            let objData = {
                title : title ? title.value.toLowerCase() : '',
                price : price ? price.value : '',
                taxes : taxes ? taxes.value : '',
                advertising : advertising ? advertising.value : '',
                discount : discount ? discount.value : '',
                total : total ? total.innerHTML : '',
                count : count ? count.value : '',
                category : category ? category.value.toLowerCase() : ''
            }            
            counterProduct(objData);
            loadStore();
            clearInput();
        }
    })
}

create();

function read(){
    let tableContent = '';
    for(let i = 0 ; i < arrData.length ; i++){
        tableContent += buildData(i);        
        if(arrData.length >= 1){        
            deleteAll();
        }
    }
    document.querySelector("tbody").innerHTML = tableContent;        
}

read();

function loadStore(){
    localStorage.setItem("creatingdata",JSON.stringify(arrData));
    read();
    window.location.reload();
}

function deleteFn(index){
    arrData.splice(index,1);
    loadStore();
}

function deleteAll(){
    document.querySelector(".deleteAllBtn").innerHTML = `<button onclick='removeFn()'>delete [ ${arrData.length} ] products </button>`;
}

function removeFn(){
    arrData.splice(0);
    loadStore();
}

function counterProduct(obj){
    if(currentMood == 'create'){
        if(obj.count >= 1 && obj.count >= 1 <= 100) for(let i = 0 ; i < obj.count ; i++) arrData.push(obj);
        else arrData.push(obj);        
    }else{
        arrData[tempIndex] = obj;
        count.style.display = 'block';
        submit.innerHTML = 'create';
    }
}

function updateFn(index){
    title.value = arrData[index].title;
    price.value = arrData[index].price;
    taxes.value = arrData[index].taxes;

    advertising.value = arrData[index].advertising;
    discount.value    = arrData[index].discount;
    category.value    = arrData[index].category;

    submit.innerHTML = 'update';
    count.style.display = 'none';
    currentMood = 'update';

    tempIndex = index;
    window.scrollTo({
        top:0,
        behavior : 'smooth'
    })
    totalPrice();
}

let searchMood = 'title';
function searchBtn(typeOfSearch){
    let searchInput = document.querySelector("#search");
    typeOfSearch === 'searchByTitle' ? searchMood = 'title' : searchMood = 'category';
    searchInput.placeholder = ('Search by '+searchMood);
    searchInput.focus();
    searchInput.value = '';
    read(); // refresh info!
}

function searchType(value){
    let searchValue = value.toLowerCase();
    let table = '';
    for(let i = 0; i < arrData.length; i++){
        if(searchMood === 'title' && arrData[i].title.includes(searchValue)){
            table +=buildData(i);            
        }else if(searchMood === 'category' && arrData[i].category.includes(searchValue)){
            table +=buildData(i);
        }
    }
    document.querySelector("tbody").innerHTML = table;
}

function buildData(i){
    return `
        <tr>
            <td>${i}</td>
            <td>${arrData[i].title}</td>
            <td>${arrData[i].price}</td>

            <td>${arrData[i].taxes}</td>
            <td>${arrData[i].advertising}</td>
            <td>${arrData[i].discount}</td>

            <td>${arrData[i].count}</td>
            <td>${arrData[i].category}</td>

            <td> <button onclick='updateFn(${i})' id='update'> update </button> </td>
            <td> <button onclick='deleteFn(${i})' id='delete' > delete </button> </td>
        </tr>
    `
}