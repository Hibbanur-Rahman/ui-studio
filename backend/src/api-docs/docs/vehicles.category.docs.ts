/**
 * Vehicle Category API Documentation
 * 
 * This file contains Swagger documentation for Vehicle Category related endpoints.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleCategoryImage:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Image URL from Cloudinary
 *           example: "https://res.cloudinary.com/example/image.jpg"
 *         description:
 *           type: string
 *           description: Image description
 *           example: "Image for category Electric Scooter"
 *         uploadDate:
 *           type: string
 *           format: date-time
 *           description: Date when image was uploaded
 *     
 *     VehicleCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "507f1f77bcf86cd799439011"
 *         categoryId:
 *           type: string
 *           description: Unique category identifier with VCAT prefix
 *           example: "VCAT_a1b2c3"
 *         name:
 *           type: string
 *           description: Category name (unique)
 *           example: "Electric Scooter"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Two-wheeled electric vehicles for city commuting"
 *         image:
 *           $ref: '#/components/schemas/VehicleCategoryImage'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     VehicleCategoryWithSno:
 *       allOf:
 *         - $ref: '#/components/schemas/VehicleCategory'
 *         - type: object
 *           properties:
 *             sno:
 *               type: number
 *               description: Serial number (descending order)
 *               example: 100
 *     
 *     CreateVehicleCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           description: Category name (must be unique)
 *           example: "Electric Scooter"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Two-wheeled electric vehicles"
 *         image:
 *           type: string
 *           format: binary
 *           description: Category image file (max 5MB)
 *     
 *     UpdateVehicleCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Category name (must be unique)
 *           example: "Updated Electric Scooter"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Updated description"
 */

/**
 * @swagger
 * tags:
 *   - name: Vehicle Categories
 *     description: Vehicle category management endpoints
 */

/**
 * @swagger
 * /vehicles/categories:
 *   post:
 *     summary: Create a new vehicle category
 *     description: Create a new vehicle category with image upload
 *     tags: [Vehicle Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name (must be unique)
 *                 example: "Electric Scooter"
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: "Two-wheeled electric vehicles for city commuting"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Category image file (required, max 5MB)
 *     responses:
 *       201:
 *         description: Vehicle category created successfully
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
 *                   example: "Vehicle category created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/VehicleCategory'
 *       400:
 *         description: Bad request - validation error or duplicate name
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
 *                   example: "Category name already exists"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   get:
 *     summary: Get all vehicle categories with pagination
 *     description: |
 *       Retrieve all vehicle categories with pagination, search, and date range filtering.
 *       At least one query parameter is required.
 *     tags: [Vehicle Categories]
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
 *         description: Search by category name or categoryId
 *         example: "Electric"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Date range filter in format DD-MM-YYYYtoDD-MM-YYYY
 *         example: "10-12-2025to29-12-2025"
 *     responses:
 *       200:
 *         description: Vehicle categories fetched successfully
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
 *                   example: "Vehicle categories fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VehicleCategoryWithSno'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 50
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 25
 *                     totalPages:
 *                       type: number
 *                       example: 2
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request - missing query parameters or invalid date format
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
 *                   example: "Please provide query parameters (limit, page, search, or date)"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /vehicles/categories/{categoryId}:
 *   get:
 *     summary: Get a specific vehicle category by ID
 *     tags: [Vehicle Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle category ID
 *         example: "VCAT_a1b2c3"
 *     responses:
 *       200:
 *         description: Vehicle category fetched successfully
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
 *                   example: "Vehicle category fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/VehicleCategory'
 *       404:
 *         description: Vehicle category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   patch:
 *     summary: Update a vehicle category
 *     description: Update category name and/or description. At least one field is required.
 *     tags: [Vehicle Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle category ID
 *         example: "VCAT_a1b2c3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicleCategoryRequest'
 *     responses:
 *       200:
 *         description: Vehicle category updated successfully
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
 *                   example: "Vehicle category updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/VehicleCategory'
 *       400:
 *         description: Bad request - validation error or duplicate name
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
 *                   example: "At least one field (name or description) is required to update"
 *       404:
 *         description: Vehicle category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *   
 *   delete:
 *     summary: Delete a vehicle category
 *     tags: [Vehicle Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle category ID
 *         example: "VCAT_a1b2c3"
 *     responses:
 *       200:
 *         description: Vehicle category deleted successfully
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
 *                   example: "Vehicle category deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/VehicleCategory'
 *       404:
 *         description: Vehicle category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /vehicles/categories/{categoryId}/vehicles:
 *   get:
 *     summary: Get all vehicles in a specific category
 *     description: Retrieve category details along with all vehicles belonging to that category
 *     tags: [Vehicle Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle category ID
 *         example: "VCAT_a1b2c3"
 *     responses:
 *       200:
 *         description: Vehicles in category fetched successfully
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
 *                   example: "Vehicles in category fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/VehicleCategory'
 *                     vehicles:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: Array of vehicles in this category
 *                     total:
 *                       type: number
 *                       description: Total number of vehicles in this category
 *                       example: 25
 *       404:
 *         description: Vehicle category not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
