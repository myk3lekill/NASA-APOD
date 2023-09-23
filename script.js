// DOM
const resultsNav = document.getElementById('resultNav');
const favoritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'RmeDfdfWNpBNrgrpbjggUofYwcOOqPiKCAfoP3f2';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];

// Update DOM (Add Cards into HTML)
function updateDOM() {
    resultsArray.forEach((result) => { //Execute the Arrow Function for each element in the array. 
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
        saveText.textContent = 'Add to Favorites'; //Add the text to the p
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

// Get 10 images from NASA API
async function getNasaPictures() {
    try {
        // Fetch Request
        const response = await fetch(apiUrl);
        resultsArray = await response.json() //populate the array with api result in json format
        console.log(resultsArray);
        updateDOM();//Update the DOM
    } catch (error) {
        // Catch Error Here
    }
}

// On Load
getNasaPictures();