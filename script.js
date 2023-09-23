// DOM
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'RmeDfdfWNpBNrgrpbjggUofYwcOOqPiKCAfoP3f2';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Inizialize Arrays and Objects
let resultsArray = [];
let favorites = {};

// Show content 
function showContent(page) {
    //Scroll to the top instantly when loader is removed
    window.scrollTo({top:0, behavior:'instant'});
    //Manipulate the Nav bar
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden'); 
    };
    //Remove the loader
    loader.classList.add('hidden');
}

// Create DOM
function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites); //Ternary operator to check if the page is the 'result' use the currentArray otherwise use the favorites
    console.log('current array',page, currentArray)
    currentArray.forEach((result) => { //Execute the Arrow Function for each element in the array. 
        //Card Container
        const card = document.createElement('div'); //Create the div
        card.classList.add('card'); //Add the class to the div
        //Link
        const link = document.createElement('a'); //Create the a
        link.href = result.hdurl; //Add the href to the a
        link.title = 'View Full Image'; //Add the title to the a
        link.target = '_blank'; //Add the target to the a setted to _blank to open image in new tab
        //Image
        const image = document.createElement('img'); //Create the img
        image.src = result.url; //Add the src tot the img
        image.alt = 'NASA Picture of the Day'; //Add the alt to the img
        image.loading = 'lazy'; //Add the loading to the img
        image.classList.add('card-img-top'); //Add the class to the img
        //Card Body
        const cardBody = document.createElement('div'); //Create the div
        cardBody.classList.add('card-body'); //Add the class to the div
        //Card Title
        const cardTitle = document.createElement('h5'); //Create the h5
        cardTitle.classList.add('card-title'); //Add the class to the h5
        cardTitle.textContent = result.title; //Add the text to the h5
        //Save Text
        const saveText = document.createElement('p'); //Create the p
        saveText.classList.add('clickable'); //Add the class tot he p
        //Show 'Add to Favorites' only if the html is different from the favorite one
        if (page === 'results') {
            saveText.textContent = 'Add to Favorites'; //Add the text to the p
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`); //Add onclick attribute to add item to favorites
        } else {
            saveText.textContent = 'Remove Favorites'; //Add the text to the p
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`); //Add onclick attribute to remove item from favorites
        }
        //Card Text
        const cardText = document.createElement('p'); //Create the p
        cardText.textContent = result.explanation; //Add the text to the p
        //Footer Container
        const footer = document.createElement('small'); //Create the small
        footer.classList.add('text-muted'); //Add the class to the small
        //Date
        const date = document.createElement('strong'); //Create the strong
        date.textContent = result.date; //Add the text to the strong
        //Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright; //Use Thernary Operator to manage undefied copyriht condition ?(if true) do this :(else) do this
        const copyright = document.createElement('span'); //Create the span
        copyright.textContent = ` ${copyrightResult}`; //Add the text to the span
        //Append
        footer.append(date, copyright); //Append date and copyright tot the footer
        cardBody.append(cardTitle, saveText, cardText, footer); //Append cardTitle, saveText, cardText and footer tot he cardBody
        link.append(image); //Append the image to the link
        card.append(link, cardBody); //Append the link and the cardBody to the card
        imagesContainer.appendChild(card); //Append child only appneds one element to the parent
    });
}

// Update DOM (Add Cards into HTML)
function updateDOM(page) {
    // Get Favorites from local storage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log('favorites from localStorage', favorites)
    };
    //update image container each time DOM is updated
    imagesContainer.textContent = '';
    // Create the DOM for the Main HTML Page
    createDOMNodes(page);
    // Show content
    showContent(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
    //Show Loader
    loader.classList.remove('hidden')
    try {
        // Fetch Request
        const response = await fetch(apiUrl);
        resultsArray = await response.json() //populate the array with api result in json format
        //console.log(resultsArray);
        updateDOM('results');//Update the DOM - use 'favorites' as parameter to pass favorites to the function and show the favorite page - Use 'results as parameter to pass results of the NASA api
    } catch (error) {
        // Catch Error Here
    }
}

// Add results to Favorites
function saveFavorite(itemUrl) {
    //Loop through resultArray to select Favorite
    resultsArray.forEach((item) => {
        //If the item url contain the item url and not yet include the favourite item url
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item; //Add to the favorites obj the item with a key of itemUrl
            //console.log(favorites); //Console should print the favorites obj with key of itemUrl and value an object that contain alla the data
            //Show save confirmation for 2 seconds
            saveConfirmed.hidden = false
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2000);
            //Store favorites into local storage (remember that to store something on servers local or not we need to convert it into json using JSON.stringfy() method)
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites)); //Set local store using 'key' and JSON.stringify(value);
            //console.log(localStorage)
        }
    })
}

// Remove item from Favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        //Update favorites in local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');//updateDOM after removing favorite
    } 
}

// On Load
getNasaPictures();