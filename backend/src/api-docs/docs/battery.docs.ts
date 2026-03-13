/**
 * Battery API Documentation
 * 
 * This file contains Swagger documentation for Battery related endpoints.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Battery:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "507f1f77bcf86cd799439011"
 *         batteryId:
 *           type: string
 *           description: Unique battery identifier
 *           example: "BAT001"
 *         manufacturer:
 *           type: string
 *           description: Battery manufacturer
 *           example: "Exide"
 *         modelNo:
 *           type: string
 *           description: Battery model number
 *           example: "EX-500"
 *         capacity:
 *           type: number
 *           description: Battery capacity in Ah (Ampere-hour)
 *           example: 50
 *         currentCharge:
 *           type: number
 *           description: Current charge percentage (0-100)
 *           example: 85
 *           minimum: 0
 *           maximum: 100
 *         description:
 *           type: string
 *           description: Battery description
 *           example: "High performance lithium-ion battery"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of battery image URLs
 *           example: ["https://res.cloudinary.com/example/image1.jpg", "https://res.cloudinary.com/example/image2.jpg"]
 *         healthStatus:
 *           type: string
 *           enum: [GOOD, FAIR, POOR, CRITICAL]
 *           description: Battery health status
 *           example: "GOOD"
 *         status:
 *           type: string
 *           enum: [AVAILABLE, IN_USE, CHARGING, MAINTENANCE]
 *           description: Battery operational status
 *           example: "AVAILABLE"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     BatteryWithSno:
 *       allOf:
 *         - $ref: '#/components/schemas/Battery'
 *         - type: object
 *           properties:
 *             sno:
 *               type: number
 *               description: Serial number (descending order)
 *               example: 100
 *     
 *     CreateBatteryRequest:
 *       type: object
 *       required:
 *         - batteryId
 *         - manufacturer
 *         - modelNo
 *         - capacity
 *         - currentCharge
 *       properties:
 *         batteryId:
 *           type: string
 *           description: Unique battery identifier
 *           example: "BAT001"
 *         manufacturer:
 *           type: string
 *           description: Battery manufacturer
 *           example: "Exide"
 *         modelNo:
 *           type: string
 *           description: Battery model number
 *           example: "EX-500"
 *         capacity:
 *           type: number
 *           description: Battery capacity in Ah (must be greater than 0)
 *           example: 50
 *           minimum: 1
 *         currentCharge:
 *           type: number
 *           description: Current charge percentage (0-100)
 *           example: 85
 *           minimum: 0
 *           maximum: 100
 *         healthStatus:
 *           type: string
 *           enum: [GOOD, FAIR, POOR, CRITICAL]
 *           description: Battery health status
 *           example: "GOOD"
 *         status:
 *           type: string
 *           enum: [AVAILABLE, IN_USE, CHARGING, MAINTENANCE]
 *           description: Battery operational status
 *           example: "AVAILABLE"
 *         description:
 *           type: string
 *           description: Battery description
 *           example: "High performance lithium-ion battery"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Battery images (max 5 files, 5MB each)
 *           maxItems: 5
 *     
 *     UpdateBatteryRequest:
 *       type: object
 *       properties:
 *         manufacturer:
 *           type: string
 *           example: "Updated Manufacturer"
 *         modelNo:
 *           type: string
 *           example: "EX-600"
 *         capacity:
 *           type: number
 *           example: 60
 *           minimum: 1
 *         currentCharge:
 *           type: number
 *           example: 90
 *           minimum: 0
 *           maximum: 100
 *         healthStatus:
 *           type: string
 *           enum: [GOOD, FAIR, POOR, CRITICAL]
 *           example: "GOOD"
 *         status:
 *           type: string
 *           enum: [AVAILABLE, IN_USE, CHARGING, MAINTENANCE]
 *           example: "AVAILABLE"
 *         description:
 *           type: string
 *           example: "Updated description"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: New battery images to add (max 5 files)
 *           maxItems: 5
 *         imagesToRemove:
 *           type: string
 *           description: Comma-separated list of image URLs to remove
 *           example: "https://example.com/image1.jpg,https://example.com/image2.jpg"
 *     
 *     BatteryStatusCounts:
 *       type: object
 *       properties:
 *         inUse:
 *           type: number
 *           example: 25
 *         maintenance:
 *           type: number
 *           example: 5
 *         available:
 *           type: number
 *           example: 120
 *         charging:
 *           type: number
 *           example: 10
 */

/**
 * @swagger
 * tags:
 *   - name: Batteries
 *     description: Battery management endpoints
 */

/**
 * @swagger
 * /batteries:
 *   post:
 *     summary: Create a new battery
 *     description: Create a new battery with optional image uploads (max 5 images)
 *     tags: [Batteries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - batteryId
 *               - manufacturer
 *               - modelNo
 *               - capacity
 *               - currentCharge
 *             properties:
 *               batteryId:
 *                 type: string
 *                 description: Unique battery identifier
 *                 example: "BAT001"
 *               manufacturer:
 *                 type: string
 *                 description: Battery manufacturer
 *                 example: "Exide"
 *               modelNo:
 *                 type: string
 *                 description: Battery model number
 *                 example: "EX-500"
 *               capacity:
 *                 type: number
 *                 description: Battery capacity in Ah (must be > 0)
 *                 example: 50
 *               currentCharge:
 *                 type: number
 *                 description: Current charge percentage (0-100)
 *                 example: 85
 *               healthStatus:
 *                 type: string
 *                 enum: [GOOD, FAIR, POOR, CRITICAL]
 *                 example: "GOOD"
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, IN_USE, CHARGING, MAINTENANCE]
 *                 example: "AVAILABLE"
 *               description:
 *                 type: string
 *                 example: "High performance lithium-ion battery"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Battery images (optional, max 5 files)
 *                 maxItems: 5
 *     responses:
 *       201:
 *         description: Battery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Battery created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Battery'
 *       400:
 *         description: Bad request - validation error or duplicate batteryId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Battery ID already exists"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   get:
 *     summary: Get all batteries with pagination and search
 *     description: |
 *       Retrieve all batteries with pagination and search functionality.
 *       At least one query parameter is required.
 *     tags: [Batteries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by batteryId, manufacturer, or modelNo
 *         example: "Exide"
 *     responses:
 *       200:
 *         description: Batteries fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Batteries fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BatteryWithSno'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 100
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 25
 *                     totalPages:
 *                       type: number
 *                       example: 4
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     statusCounts:
 *                       $ref: '#/components/schemas/BatteryStatusCounts'
 *       400:
 *         description: Bad request - missing query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please provide query parameters (limit, page, or search)"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /batteries/export:
 *   get:
 *     summary: Export batteries with S.NO range or date range filters
 *     description: |
 *       Export batteries with optional filters:
 *       - Maximum 200 records per export when using S.NO range
 *       - Maximum 30 days period when using date range
 *       - Can filter by status
 *     tags: [Batteries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: snoStart
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Starting serial number (use with snoEnd)
 *         example: 1
 *       - in: query
 *         name: snoEnd
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Ending serial number (max 200 records from start)
 *         example: 200
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *         example: "2026-01-01"
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format (max 30 days from dateFrom)
 *         example: "2026-01-30"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, IN_USE, CHARGING, MAINTENANCE]
 *           default: AVAILABLE
 *         description: Filter by battery status
 *     responses:
 *       200:
 *         description: Batteries exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Batteries exported successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Battery'
 *                 count:
 *                   type: number
 *                   description: Total number of exported batteries
 *                   example: 150
 *       400:
 *         description: Bad request - Invalid range or parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /batteries/{batteryId}:
 *   get:
 *     summary: Get a specific battery by ID
 *     tags: [Batteries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batteryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Battery ID
 *         example: "BAT001"
 *     responses:
 *       200:
 *         description: Battery fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Battery fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Battery'
 *       404:
 *         description: Battery not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   patch:
 *     summary: Update a battery
 *     description: |
 *       Update battery details with optional image management:
 *       - Add new images (max 5 files)
 *       - Remove existing images using imagesToRemove parameter
 *       - Update battery properties
 *     tags: [Batteries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batteryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Battery ID
 *         example: "BAT001"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               manufacturer:
 *                 type: string
 *                 example: "Updated Manufacturer"
 *               modelNo:
 *                 type: string
 *                 example: "EX-600"
 *               capacity:
 *                 type: number
 *                 example: 60
 *               currentCharge:
 *                 type: number
 *                 example: 90
 *                 minimum: 0
 *                 maximum: 100
 *               healthStatus:
 *                 type: string
 *                 enum: [GOOD, FAIR, POOR, CRITICAL]
 *                 example: "GOOD"
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, IN_USE, CHARGING, MAINTENANCE]
 *                 example: "CHARGING"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New images to add (max 5 files)
 *                 maxItems: 5
 *               imagesToRemove:
 *                 type: string
 *                 description: Comma-separated image URLs to remove
 *                 example: "https://example.com/old1.jpg,https://example.com/old2.jpg"
 *     responses:
 *       200:
 *         description: Battery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Battery updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Battery'
 *       400:
 *         description: Bad request - validation error or no fields to update
 *       404:
 *         description: Battery not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   delete:
 *     summary: Delete a battery
 *     description: Delete a battery and its associated images from Cloudinary
 *     tags: [Batteries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batteryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Battery ID
 *         example: "BAT001"
 *     responses:
 *       200:
 *         description: Battery deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Battery deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Battery'
 *       404:
 *         description: Battery not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
