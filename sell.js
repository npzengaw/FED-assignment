document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get("edit");

    if (listingId) {
        await loadListingForEdit(listingId);
    }

    document.getElementById("add-listing-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        await saveListing(listingId);
    });
});

async function loadListingForEdit(listingId) {
    try {
        const response = await fetch(`http://localhost:5000/api/listings/${listingId}`);
        if (!response.ok) throw new Error("Failed to load listing.");

        const listing = await response.json();
        document.getElementById("listing-id").value = listing._id;
        document.getElementById("title").value = listing.title;
        document.getElementById("description").value = listing.description;
        document.getElementById("price").value = listing.price;
        document.getElementById("image").value = listing.image;
    } catch (error) {
        console.error("Error loading listing:", error);
    }
}

async function saveListing(listingId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in.");
        return;
    }

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    const method = listingId ? "PUT" : "POST";
    const endpoint = listingId ? `http://localhost:5000/api/listings/${listingId}` : "http://localhost:5000/api/listings";

    try {
        const response = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json", "Authorization": token },
            body: JSON.stringify({ title, description, price, image })
        });

        if (!response.ok) throw new Error("Failed to save listing.");

        alert("Listing saved successfully!");
        window.location.href = "profile.html";
    } catch (error) {
        console.error("Error saving listing:", error);
    }
}
