/**
 * Hub API Documentation
 * 
 * This file contains Swagger documentation for Hub related endpoints.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - latitude
 *         - longitude
 *       properties:
 *         latitude:
 *           type: number
 *           description: Latitude coordinate
 *           example: 25.6234486
 *         longitude:
 *           type: number
 *           description: Longitude coordinate
 *           example: 65.999
 *         address:
 *           type: string
 *           description: Full address
 *           example: "Hayaghat, darbhanga, Bihar"
 *         landmark:
 *           type: string
 *           description: Nearby landmark
 *           example: "near jama masjid"
 *     
 *     Timings:
 *       type: object
 *       required:
 *         - openTime
 *         - closeTime
 *       properties:
 *         openTime:
 *           type: string
 *           description: Opening time in HH:mm format
 *           example: "08:34"
 *         closeTime:
 *           type: string
 *           description: Closing time in HH:mm format
 *           example: "20:40"
 *     
 *     HubImage:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Image URL
 *           example: "https://example.com/hub-image.jpg"
 *         description:
 *           type: string
 *           description: Image description
 *           example: "Hub front view"
 *         uploadDate:
 *           type: string
 *           format: date-time
 *           description: Date when image was uploaded
 *     
 *     HubLog:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID who performed the action
 *           example: "ADM_65c7d793"
 *         description:
 *           type: string
 *           description: Activity description
 *           example: "Hub created successfully"
 *         activityDate:
 *           type: string
 *           format: date-time
 *           description: Date of the activity
 *     
 *     Hub:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "507f1f77bcf86cd799439011"
 *         hubId:
 *           type: string
 *           description: Unique hub identifier
 *           example: "hub_2dff9da5"
 *         name:
 *           type: string
 *           description: Hub name
 *           example: "Hayaghat hub101"
 *         description:
 *           type: string
 *           description: Hub description
 *           example: "Hayaghat Hub with more than 1000 vehicles"
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HubImage'
 *         timings:
 *           $ref: '#/components/schemas/Timings'
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           description: Hub status
 *           example: "ACTIVE"
 *         createdBy:
 *           type: string
 *           description: User ID who created the hub
 *           example: "ADM_65c7d793"
 *         isDeleted:
 *           type: boolean
 *           description: Soft delete flag
 *           example: false
 *         logs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HubLog'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     HubListItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         hubId:
 *           type: string
 *           example: "hub_2dff9da5"
 *         name:
 *           type: string
 *           example: "Hayaghat hub101"
 *         description:
 *           type: string
 *           example: "Hayaghat Hub with more than 1000 vehicles"
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         timings:
 *           $ref: '#/components/schemas/Timings'
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: "ACTIVE"
 *         sno:
 *           type: number
 *           description: Serial number for the current page
 *           example: 1
 *     
 *     CreateHubRequest:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - timings
 *       properties:
 *         name:
 *           type: string
 *           example: "Hayaghat hub101"
 *         description:
 *           type: string
 *           example: "Hayaghat Hub with more than 1000 vehicles locate in bilaspur"
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         timings:
 *           $ref: '#/components/schemas/Timings'
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           default: ACTIVE
 *           example: "ACTIVE"
 *     
 *     UpdateHubRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "SAMASTIPUR"
 *         description:
 *           type: string
 *           example: ""
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         timings:
 *           $ref: '#/components/schemas/Timings'
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: "ACTIVE"
 *     
 *     VehicleStats:
 *       type: object
 *       properties:
 *         totalVehicles:
 *           type: number
 *           example: 150
 *         availableVehicles:
 *           type: number
 *           example: 120
 *         occupiedVehicles:
 *           type: number
 *           example: 20
 *         maintenanceVehicles:
 *           type: number
 *           example: 10
 */

/**
 * @swagger
 * tags:
 *   - name: Hubs
 *     description: Hub management endpoints
 */

/**
 * @swagger
 * /hubs:
 *   get:
 *     summary: Get all hubs with pagination and filtering
 *     tags: [Hubs]
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
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by hub name or description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, ALL]
 *           default: ACTIVE
 *         description: Filter by hub status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt:desc
 *         description: Sort field and order (format - field:order, e.g., createdAt:desc)
 *     responses:
 *       200:
 *         description: Hubs fetched successfully
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
 *                   example: "Hubs fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     hubs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/HubListItem'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: number
 *                           example: 1
 *                         totalPages:
 *                           type: number
 *                           example: 5
 *                         limit:
 *                           type: number
 *                           example: 10
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPrevPage:
 *                           type: boolean
 *                           example: false
 *                         totalAllHubs:
 *                           type: number
 *                           example: 50
 *                         totalActiveHubs:
 *                           type: number
 *                           example: 45
 *                         totalInactiveHubs:
 *                           type: number
 *                           example: 5
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   post:
 *     summary: Create a new hub
 *     tags: [Hubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHubRequest'
 *     responses:
 *       200:
 *         description: Hub created successfully
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
 *                   example: "Hub created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hub'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /hubs/export:
 *   get:
 *     summary: Export hubs with S.NO range or date range filters
 *     description: |
 *       Export hubs to Excel/CSV format with optional filters.
 *       - Maximum 200 records per export when using S.NO range
 *       - Maximum 30 days period when using date range
 *       - Can combine both filters
 *     tags: [Hubs]
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
 *         description: Ending serial number (max 200 records)
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
 *           enum: [ACTIVE, INACTIVE, ALL]
 *           default: ACTIVE
 *         description: Filter by hub status
 *     responses:
 *       200:
 *         description: Hubs exported successfully
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
 *                   example: "Hubs exported successfully"
 *                 data:
 *                   type: object
 *                   description: Export data with filtered hubs
 *       400:
 *         description: Bad request - Invalid range or parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: No hubs found for the specified criteria
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /hubs/{hubId}:
 *   get:
 *     summary: Get a specific hub by ID
 *     description: Retrieve hub details with optional vehicle information and pagination
 *     tags: [Hubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hub ID
 *         example: "hub_2dff9da5"
 *       - in: query
 *         name: vehicles
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include vehicles list in response
 *         example: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (only if vehicles=true)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *         description: Number of vehicles per page (only if vehicles=true)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search vehicles by registration number or model (only if vehicles=true)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, IN_USE, RENTED, MAINTENANCE, UNDER_MAINTENANCE, TOTAL]
 *           default: TOTAL
 *         description: Filter vehicles by status (only if vehicles=true)
 *     responses:
 *       200:
 *         description: Hub fetched successfully
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
 *                   example: "Hub fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     hubId:
 *                       type: string
 *                       example: "hub_2dff9da5"
 *                     name:
 *                       type: string
 *                       example: "Hayaghat hub101"
 *                     description:
 *                       type: string
 *                     location:
 *                       $ref: '#/components/schemas/Location'
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of image URLs
 *                       example: ["https://example.com/image1.jpg"]
 *                     timings:
 *                       $ref: '#/components/schemas/Timings'
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *                     logs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/HubLog'
 *                     stats:
 *                       $ref: '#/components/schemas/VehicleStats'
 *                     vehiclesData:
 *                       type: object
 *                       description: Only included if vehicles=true
 *                       properties:
 *                         vehicles:
 *                           type: array
 *                           items:
 *                             type: object
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             currentPage:
 *                               type: number
 *                             totalPages:
 *                               type: number
 *                             limit:
 *                               type: number
 *                             hasNextPage:
 *                               type: boolean
 *                             hasPrevPage:
 *                               type: boolean
 *       404:
 *         description: Hub not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   patch:
 *     summary: Update a hub
 *     tags: [Hubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hub ID
 *         example: "hub_2dff9da5"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateHubRequest'
 *     responses:
 *       200:
 *         description: Hub updated successfully
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
 *                   example: "Hub updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hub'
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Hub not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   delete:
 *     summary: Delete a hub
 *     tags: [Hubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hub ID
 *         example: "hub_2dff9da5"
 *     responses:
 *       200:
 *         description: Hub deleted successfully
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
 *                   example: "Hub deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hub'
 *       404:
 *         description: Hub not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /hubs/{hubId}/images:
 *   patch:
 *     summary: Upload images for a hub
 *     tags: [Hubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hubId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hub ID
 *         example: "hub_f20aa"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files (max 10, max 20MB each)
 *     responses:
 *       200:
 *         description: Hub images uploaded successfully
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
 *                   example: "Hub images uploaded successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hub'
 *       400:
 *         description: Bad request - No images provided or file size exceeded
 *       404:
 *         description: Hub not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
