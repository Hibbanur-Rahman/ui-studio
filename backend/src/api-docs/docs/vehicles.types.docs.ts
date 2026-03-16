/**
 * Vehicle Types API Documentation
 * 
 * This file contains Swagger documentation for Vehicle Types related endpoints.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleType:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "507f1f77bcf86cd799439011"
 *         vehicleTypeId:
 *           type: string
 *           description: Unique vehicle type identifier
 *           example: "VTYPE_af40e"
 *         name:
 *           type: string
 *           description: Name of the vehicle type
 *           example: "Bajaj Vyira 121"
 *         description:
 *           type: string
 *           description: Description of the vehicle type
 *           example: "Bajaj Vyria 121 with swapable battery"
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com/image1.jpg"
 *               description:
 *                 type: string
 *                 example: "vehicle type image 1"
 *               uploadDate:
 *                 type: string
 *                 format: date-time
 *           description: Array of image objects
 *         rentalPricePerDay:
 *           type: number
 *           description: Rental price per day
 *           example: 210
 *         isLicenseRequired:
 *           type: boolean
 *           description: Whether a license is required
 *           example: true
 *         isHelmetRequired:
 *           type: boolean
 *           description: Whether a helmet is required
 *           example: true
 *         rangeInKm:
 *           type: number
 *           description: Range in kilometers
 *           example: 100
 *         maxSpeedInKmh:
 *           type: number
 *           description: Maximum speed in km/h
 *           example: 80
 *         isBatterySwappable:
 *           type: boolean
 *           description: Whether the battery is swappable
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     VehicleTypeListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             vehicleTypes:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleType'
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 50
 *                 page:
 *                   type: number
 *                   example: 1
 *                 limit:
 *                   type: number
 *                   example: 25
 *                 totalPages:
 *                   type: number
 *                   example: 2
 *     
 *     CreateVehicleTypeRequest:
 *       type: object
 *       required:
 *         - name
 *         - rentalPricePerDay
 *         - isLicenseRequired
 *         - isHelmetRequired
 *       properties:
 *         name:
 *           type: string
 *           example: "Bajaj Vyira 121"
 *         description:
 *           type: string
 *           example: "Bajaj Vyria 121 with swapable battery"
 *         rentalPricePerDay:
 *           type: number
 *           example: 210
 *         isLicenseRequired:
 *           type: boolean
 *           example: true
 *         isHelmetRequired:
 *           type: boolean
 *           example: true
 *         rangeInKm:
 *           type: number
 *           example: 100
 *         maxSpeedInKmh:
 *           type: number
 *           example: 80
 *         isBatterySwappable:
 *           type: boolean
 *           example: true
 *     
 *     UpdateVehicleTypeRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Updated Bajaj Vyira 121"
 *         description:
 *           type: string
 *           example: "Updated description"
 *         rentalPricePerDay:
 *           type: number
 *           example: 220
 *         isLicenseRequired:
 *           type: boolean
 *           example: true
 *         isHelmetRequired:
 *           type: boolean
 *           example: true
 *         rangeInKm:
 *           type: number
 *           example: 120
 *         maxSpeedInKmh:
 *           type: number
 *           example: 85
 *         isBatterySwappable:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * tags:
 *   - name: Vehicle Types
 *     description: Vehicle type management endpoints
 */

/**
 * @swagger
 * /vehicles/types:
 *   post:
 *     summary: Create a new vehicle type
 *     tags: [Vehicle Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehicleTypeRequest'
 *     responses:
 *       201:
 *         description: Vehicle type created successfully
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
 *                   example: "Vehicle type created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/VehicleType'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   get:
 *     summary: Get all vehicle types
 *     tags: [Vehicle Types]
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
 *         description: Search by name or description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: Vehicle types retrieved successfully
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
 *                   example: "Vehicle types fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VehicleType'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 10
 *                     total:
 *                       type: number
 *                       example: 50
 *                     totalPages:
 *                       type: number
 *                       example: 5
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error */
/**
 * @swagger
 * /vehicles/types/{vehicleTypeId}:
 *   get:
 *     summary: Get a specific vehicle type by ID
 *     tags: [Vehicle Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle type ID
 *         example: "VTYPE_af40e"
 *     responses:
 *       200:
 *         description: Vehicle type retrieved successfully
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
 *                   example: "Vehicle type fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/VehicleType'
 *       404:
 *         description: Vehicle type not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   patch:
 *     summary: Update a vehicle type
 *     tags: [Vehicle Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle type ID
 *         example: "VTYPE_af40e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicleTypeRequest'
 *     responses:
 *       200:
 *         description: Vehicle type updated successfully
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
 *                   example: "Vehicle type updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/VehicleType'
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Vehicle type not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   delete:
 *     summary: Delete a vehicle type
 *     tags: [Vehicle Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle type ID
 *         example: "VTYPE_af40e"
 *     responses:
 *       200:
 *         description: Vehicle type deleted successfully
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
 *                   example: "Vehicle type deleted successfully"
 *       404:
 *         description: Vehicle type not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error */
/**
 * @swagger
 * /vehicles/types/{vehicleTypeId}/upload-images:
 *   post:
 *     summary: Upload images for a vehicle type
 *     tags: [Vehicle Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle type ID
 *         example: "VTYPE_af40e"
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
 *                 description: Image files (max 5, max 5MB each)
 *     responses:
 *       200:
 *         description: Vehicle type images uploaded successfully
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
 *                   example: "Vehicle type images uploaded successfully"
 *                 data:
 *                   $ref: '#/components/schemas/VehicleType'
 *       400:
 *         description: Bad request - validation error or file size exceeded
 *       404:
 *         description: Vehicle type not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
*/