const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const searchTerm = `%${q.toLowerCase()}%`;
        const { rows } = await sql`
            SELECT 
                officename AS "Name",
                pincode AS "Pincode",
                districtname AS "District",
                statename AS "State"
            FROM pincodes 
            WHERE 
                LOWER(officename) LIKE ${searchTerm} OR 
                LOWER(districtname) LIKE ${searchTerm}
            LIMIT 100;
        `;

        if (rows.length > 0) {
            res.status(200).json([{ Status: 'Success', PostOffice: rows }]);
        } else {
            res.status(200).json([{ Status: 'Error', Message: 'No results found.' }]);
        }
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};