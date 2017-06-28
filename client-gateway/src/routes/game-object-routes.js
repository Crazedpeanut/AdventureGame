const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const sectorId = req.query.sectorId;
    const worldId = req.query.worldId;
    const gameObjectType = req.query.type;
    res.send(`SectorId: ${sectorId} WorldId: ${worldId}`);
});

module.exports = router;