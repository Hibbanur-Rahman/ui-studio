/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "507f1f77bcf86cd799439011"
 *         userId:
 *           type: string
 *           description: Unique user ID
 *           example: "USR001"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "+919876543210"
 *         role:
 *           type: string
 *           enum: [USER, STAFF, ADMIN]
 *           example: "USER"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isPasscodeSet:
 *           type: boolean
 *           example: false
 *         profileImage:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *         currentEarning:
 *           type: number
 *           example: 5000.50
 *         address:
 *           type: object
 *           properties:
 *             houseNo:
 *               type: string
 *             street:
 *               type: string
 *             landmark:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             pinCode:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     UserListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 100
 *                 page:
 *                   type: number
 *                   example: 1
 *                 limit:
 *                   type: number
 *                   example: 25
 *                 totalPages:
 *                   type: number
 *                   example: 4
 *     
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "+919876543210"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         city:
 *           type: string
 *           example: "Mumbai"
 *         pinCode:
 *           type: string
 *           example: "400001"
 *         houseNo:
 *           type: string
 *           example: "123"
 *         street:
 *           type: string
 *           example: "Main Street"
 *         landmark:
 *           type: string
 *           example: "Near Park"
 *         currentEarning:
 *           type: number
 *           example: 5000.50
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * /users/health:
 *   get:
 *     summary: Check users service health
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users service is running
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
 *                   example: "users route is running well"
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users list with filters and pagination
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, inactive, visitors]
 *         description: |
 *           Filter by user status:
 *           - all: All users
 *           - active: Active users (isActive=true)
 *           - inactive: Inactive users (isActive=false)
 *           - visitors: Users without passcode set (isPasscodeSet=false)
 *         example: "all"
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, STAFF, ADMIN]
 *         description: Filter by user role
 *         example: "USER"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, phone, or userId
 *         example: "John"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 25
 *         description: Number of users per page
 *         example: 25
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *         example: 1
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid query parameters
 */

/**
 * @swagger
 * /users/profile/{id}:
 *   get:
 *     summary: Get full user profile details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User MongoDB ObjectId
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/update/{id}:
 *   patch:
 *     summary: Update user profile or status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User MongoDB ObjectId
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Update user isActive status
 *         example: "active"
 *       - in: query
 *         name: profile
 *         schema:
 *           type: string
 *           enum: [details, allDetails]
 *         description: |
 *           Update user profile:
 *           - details: Update basic info (name, email, phone, status)
 *           - allDetails: Update all personal info including address and earnings
 *         example: "details"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: "User updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 */
