const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all service providers with pagination and filtering
router.get('/providers', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 9,
            category,
            location,
            rating,
            search
        } = req.query;

        const offset = (page - 1) * limit;
        let query = `
            SELECT 
                sp.*,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.email_verified,
                u.phone_verified,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(r.id) as review_count,
                COUNT(DISTINCT j.id) as completed_jobs
            FROM service_providers sp
            JOIN users u ON sp.user_id = u.id
            LEFT JOIN reviews r ON sp.id = r.service_provider_id
            LEFT JOIN jobs j ON sp.id = j.service_provider_id AND j.status = 'completed'
            WHERE sp.verification_status = 'approved'
        `;

        const queryParams = [];

        // Add filters
        if (category) {
            query += ` AND sp.service_category = ?`;
            queryParams.push(category);
        }

        if (location) {
            query += ` AND sp.location LIKE ?`;
            queryParams.push(`%${location}%`);
        }

        if (search) {
            query += ` AND (sp.full_name LIKE ? OR sp.work_description LIKE ? OR sp.service_category LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` GROUP BY sp.id`;

        if (rating) {
            query += ` HAVING avg_rating >= ?`;
            queryParams.push(rating);
        }

        query += ` ORDER BY avg_rating DESC, completed_jobs DESC`;
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [providers] = await pool.query(query, queryParams);

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(DISTINCT sp.id) as total
            FROM service_providers sp
            JOIN users u ON sp.user_id = u.id
            LEFT JOIN reviews r ON sp.id = r.service_provider_id
            WHERE sp.verification_status = 'approved'
        `;

        const countParams = [];

        if (category) {
            countQuery += ` AND sp.service_category = ?`;
            countParams.push(category);
        }

        if (location) {
            countQuery += ` AND sp.location LIKE ?`;
            countParams.push(`%${location}%`);
        }

        if (search) {
            countQuery += ` AND (sp.full_name LIKE ? OR sp.work_description LIKE ? OR sp.service_category LIKE ?)`;
            countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (rating) {
            countQuery = `
                SELECT COUNT(*) as total FROM (
                    ${countQuery}
                    GROUP BY sp.id
                    HAVING AVG(r.rating) >= ?
                ) as filtered_providers
            `;
            countParams.push(rating);
        }

        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;

        // Format provider data
        const formattedProviders = providers.map(provider => ({
            id: provider.id,
            name: provider.full_name,
            category: provider.service_category,
            location: provider.location,
            rating: parseFloat(provider.avg_rating) || 0,
            reviewCount: provider.review_count,
            description: provider.work_description,
            phone: provider.phone,
            email: provider.email,
            photo: provider.photo_path ? `/uploads/service-providers/${provider.photo_path}` : '/Resources/images/user.jpg',
            isOnline: true, // You can implement online status tracking
            completedJobs: provider.completed_jobs,
            experience: provider.experience || 'তথ্য নেই',
            priceRange: provider.price_range || 'আলোচনা সাপেক্ষে',
            workingHours: provider.working_hours || 'সকাল ৯টা - সন্ধ্যা ৬টা',
            specialties: provider.specialties ? JSON.parse(provider.specialties) : [],
            createdAt: provider.created_at,
            updatedAt: provider.updated_at
        }));

        res.json({
            success: true,
            data: {
                providers: formattedProviders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({
            success: false,
            message: 'সেবা প্রোভাইডার তালিকা লোড করতে সমস্যা হয়েছে',
            error: error.message
        });
    }
});

// Get provider details by ID
router.get('/providers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [providers] = await pool.query(`
            SELECT 
                sp.*,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.email_verified,
                u.phone_verified,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(r.id) as review_count,
                COUNT(DISTINCT j.id) as completed_jobs
            FROM service_providers sp
            JOIN users u ON sp.user_id = u.id
            LEFT JOIN reviews r ON sp.id = r.service_provider_id
            LEFT JOIN jobs j ON sp.id = j.service_provider_id AND j.status = 'completed'
            WHERE sp.id = ?
            GROUP BY sp.id
        `, [id]);

        if (providers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'সেবা প্রোভাইডার পাওয়া যায়নি'
            });
        }

        const provider = providers[0];

        // Get recent reviews
        const [reviews] = await pool.query(`
            SELECT 
                r.*,
                u.first_name,
                u.last_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.service_provider_id = ?
            ORDER BY r.created_at DESC
            LIMIT 5
        `, [id]);

        const formattedProvider = {
            id: provider.id,
            name: provider.full_name,
            category: provider.service_category,
            location: provider.location,
            rating: parseFloat(provider.avg_rating) || 0,
            reviewCount: provider.review_count,
            description: provider.work_description,
            phone: provider.phone,
            email: provider.email,
            photo: provider.photo_path ? `/uploads/service-providers/${provider.photo_path}` : '/Resources/images/user.jpg',
            isOnline: true,
            completedJobs: provider.completed_jobs,
            experience: provider.experience || 'তথ্য নেই',
            priceRange: provider.price_range || 'আলোচনা সাপেক্ষে',
            workingHours: provider.working_hours || 'সকাল ৯টা - সন্ধ্যা ৬টা',
            specialties: provider.specialties ? JSON.parse(provider.specialties) : [],
            verificationStatus: provider.verification_status,
            reviews: reviews.map(review => ({
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                customerName: `${review.first_name} ${review.last_name}`,
                createdAt: review.created_at
            })),
            createdAt: provider.created_at,
            updatedAt: provider.updated_at
        };

        res.json({
            success: true,
            data: formattedProvider
        });

    } catch (error) {
        console.error('Error fetching provider details:', error);
        res.status(500).json({
            success: false,
            message: 'সেবা প্রোভাইডার বিস্তারিত লোড করতে সমস্যা হয়েছে',
            error: error.message
        });
    }
});

// Send message to provider
router.post('/providers/:id/message', async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, message, senderUserId } = req.body;

        if (!subject || !message || !senderUserId) {
            return res.status(400).json({
                success: false,
                message: 'সব তথ্য প্রদান করুন'
            });
        }

        // Get provider's user ID
        const [provider] = await pool.query(
            'SELECT user_id FROM service_providers WHERE id = ?',
            [id]
        );

        if (provider.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'সেবা প্রোভাইডার পাওয়া যায়নি'
            });
        }

        // Insert message
        const [result] = await pool.query(`
            INSERT INTO messages (sender_id, receiver_id, subject, message, message_type)
            VALUES (?, ?, ?, ?, 'service_inquiry')
        `, [senderUserId, provider[0].user_id, subject, message]);

        // Create notification for provider
        await pool.query(`
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (?, ?, ?, 'message')
        `, [
            provider[0].user_id,
            'নতুন মেসেজ',
            `আপনার কাছে নতুন একটি সেবা সংক্রান্ত মেসেজ এসেছে।`
        ]);

        res.json({
            success: true,
            message: 'আপনার মেসেজ সফলভাবে পাঠানো হয়েছে',
            data: { messageId: result.insertId }
        });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'মেসেজ পাঠাতে সমস্যা হয়েছে',
            error: error.message
        });
    }
});

// Get service categories
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.query(`
            SELECT service_category, COUNT(*) as provider_count
            FROM service_providers 
            WHERE verification_status = 'approved'
            GROUP BY service_category
            ORDER BY provider_count DESC
        `);

        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'ক্যাটেগরি তালিকা লোড করতে সমস্যা হয়েছে',
            error: error.message
        });
    }
});

// Get locations
router.get('/locations', async (req, res) => {
    try {
        const [locations] = await pool.query(`
            SELECT location, COUNT(*) as provider_count
            FROM service_providers 
            WHERE verification_status = 'approved'
            GROUP BY location
            ORDER BY provider_count DESC
        `);

        res.json({
            success: true,
            data: locations
        });

    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({
            success: false,
            message: 'এলাকার তালিকা লোড করতে সমস্যা হয়েছে',
            error: error.message
        });
    }
});

module.exports = router;
