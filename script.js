// RESTdb.io API Configuration
const API_URL = 'https://mokesell-ec88.restdb.io/rest/listing'; // Replace with your RESTdb.io endpoint
const API_KEY = '679628de0acc0620a20d364d'; // Replace with your RESTdb.io API key

// Fetch and Display Listings
async function fetchListings() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching listings: ${response.status}`);
        }

        const listings = await response.json();
        const listingsContainer = document.getElementById('featured-listings');
        listingsContainer.innerHTML = ''; // Clear any existing listings

        listings.forEach((listing) => {
            const listingElement = document.createElement('div');
            listingElement.className = 'listing';
            listingElement.innerHTML = `
                <img src="${listing.image}" alt="${listing.title}" />
                <h3>${listing.title}</h3>
                <p>${listing.description}</p>
                <span>Price: $${listing.price}</span>
            `;
            listingsContainer.appendChild(listingElement);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to fetch listings. Please try again later.');
    }
}

// Add a New Listing
async function addListing(title, description, price, image) {
    try {
        const newListing = {
            title,
            description,
            price,
            image,
            createdAt: new Date() // Automatically add timestamp
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': API_KEY
            },
            body: JSON.stringify(newListing)
        });

        if (!response.ok) {
            throw new Error(`Error adding listing: ${response.status}`);
        }

        alert('Listing added successfully!');
        fetchListings(); // Refresh the listings
    } catch (error) {
        console.error(error);
        alert('Failed to add listing. Please try again later.');
    }
}

// Handle Add Listing Form Submission
document.getElementById('add-listing-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const title = event.target.title.value;
    const description = event.target.description.value;
    const price = parseFloat(event.target.price.value);
    const image = event.target.image.value;

    await addListing(title, description, price, image);

    // Reset form after submission
    event.target.reset();
});

// Initialize Listings on Page Load
document.addEventListener('DOMContentLoaded', fetchListings);
