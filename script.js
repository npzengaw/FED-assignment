document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api/listings'; // Replace with deployed URL

    // Fetch Listings
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const listingsContainer = document.getElementById('featured-listings');
            data.forEach(listing => {
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
        })
        .catch(error => console.error('Error fetching listings:', error));

    // Add New Listing (example for a form submission)
    const addListingForm = document.getElementById('add-listing-form');
    if (addListingForm) {
        addListingForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(addListingForm);
            const newListing = {
                title: formData.get('title'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                image: formData.get('image') // This could be a URL for now
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newListing)
                });
                const data = await response.json();
                console.log('Listing added:', data);
                location.reload(); // Reload to see the new listing
            } catch (error) {
                console.error('Error adding listing:', error);
            }
        });
    }
});
