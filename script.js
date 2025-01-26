// RESTdb.io API Configuration
const API_URL = 'https://mokesell-ec88.restdb.io/rest/listing'; // Replace with your RESTdb.io endpoint
const API_KEY = '9d9fa97fe7f8b7f060127eafaa34a4a4cdf33'; // Replace with your RESTdb.io API key

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
        console.log('Fetched listings:', listings); // Debugging: Log fetched data

        const listingsContainer = document.getElementById('featured-listings');
        listingsContainer.innerHTML = ''; // Clear any existing listings

        if (listings.length === 0) {
            // Handle case where no listings are available
            listingsContainer.innerHTML = '<p>No listings available. Please add some items!</p>';
            return;
        }

        listings.forEach((listing) => {
            const listingElement = document.createElement('div');
            listingElement.className = 'listing';
            listingElement.innerHTML = `
                <img src="${listing.image}" alt="${listing.title}" onerror="this.src='https://via.placeholder.com/150';" />
                <h3>${listing.title}</h3>
                <p>${listing.description}</p>
                <span>Price: $${listing.price}</span>
            `;
            listingsContainer.appendChild(listingElement);
        });
    } catch (error) {
        console.error('Error fetching listings:', error.message);
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
        console.error('Error adding listing:', error.message);
        alert('Failed to add listing. Please try again later.');
    }
}

// Handle Add Listing Form Submission
document.getElementById('add-listing-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const title = event.target.title.value.trim();
    const description = event.target.description.value.trim();
    const price = parseFloat(event.target.price.value.trim());
    const image = event.target.image.value.trim();

    if (!title || !description || isNaN(price) || !image) {
        alert('All fields are required. Please fill them out correctly.');
        return;
    }

    await addListing(title, description, price, image);

    // Reset form after submission
    event.target.reset();
});

// Initialize Listings on Page Load
document.addEventListener('DOMContentLoaded', fetchListings);
