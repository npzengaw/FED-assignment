const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Get all listings
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find();
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new listing
router.post('/', async (req, res) => {
    const { title, description, price, image } = req.body;
    const listing = new Listing({ title, description, price, image });

    try {
        const newListing = await listing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
