document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("You need to log in to access your profile.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("profile-username").textContent = user.username;
    await loadUserListings();
});

async function loadUserListings() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
        alert("Unauthorized access.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/listings/user/${user.email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user listings.");
        }

        const listings = await response.json();
        const listingsContainer = document.getElementById("user-listings-container");

        if (listings.length === 0) {
            listingsContainer.innerHTML = "<p>No listings yet. Start selling now!</p>";
            return;
        }

        listingsContainer.innerHTML = listings.map(
            (item) => `
                <div class="listing-item">
                    <img src="${item.image}" alt="${item.title}">
                    <h4>${item.title}</h4>
                    <p>S$${item.price}</p>
                    <button onclick="editListing('${item._id}')">Edit</button>
                    <button onclick="deleteListing('${item._id}')">Delete</button>
                </div>
            `
        ).join("");
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

async function deleteListing(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Unauthorized access.");
        return;
    }

    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/listings/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": token }
        });

        if (!response.ok) {
            throw new Error("Failed to delete listing.");
        }

        alert("Listing deleted successfully!");
        loadUserListings();
    } catch (error) {
        console.error("Error deleting listing:", error);
    }
}

function editListing(id) {
    window.location.href = `sell.html?edit=${id}`;
}
