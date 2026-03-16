/**
 * @swagger
 * components:
 *   schemas:
 *     PersonalInfoRequest:
 *       type: object
 *       required:
 *         - dateOfBirth
 *         - gender
 *         - address
 *       properties:
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *           example: "1990-01-15"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           description: User's gender
 *           example: "MALE"
 *         address:
 *           type: object
 *           properties:
 *             houseNo:
 *               type: string
 *               example: "123"
 *             street:
 *               type: string
 *               example: "Main Street"
 *             landmark:
 *               type: string
 *               example: "Near Park"
 *             city:
 *               type: string
 *               example: "Mumbai"
 *             state:
 *               type: string
 *               example: "Maharashtra"
 *             pinCode:
 *               type: string
 *               example: "400001"
 *     
 *     NomineeRequest:
 *       type: object
 *       required:
 *         - nomineeName
 *         - nomineeRelation
 *         - nomineePhone
 *       properties:
 *         nomineeName:
 *           type: string
 *           example: "Jane Doe"
 *         nomineeRelation:
 *           type: string
 *           example: "Spouse"
 *         nomineePhone:
 *           type: string
 *           example: "+919876543210"
 *     
 *     AadharVerifyRequest:
 *       type: object
 *       required:
 *         - aadharNumber
 *       properties:
 *         aadharNumber:
 *           type: string
 *           description: 12-digit Aadhar number
 *           example: "123456789012"
 *     
 *     BankDetailsRequest:
 *       type: object
 *       required:
 *         - accountHolderName
 *         - accountNumber
 *         - ifscCode
 *         - bankName
 *       properties:
 *         accountHolderName:
 *           type: string
 *           example: "John Doe"
 *         accountNumber:
 *           type: string
 *           example: "1234567890"
 *         ifscCode:
 *           type: string
 *           example: "HDFC0001234"
 *         bankName:
 *           type: string
 *           example: "HDFC Bank"
 *         branchName:
 *           type: string
 *           example: "Mumbai Main Branch"
 *     
 *     KYCStatus:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             personalInfo:
 *               type: boolean
 *               example: true
 *             profileImage:
 *               type: boolean
 *               example: true
 *             aadhar:
 *               type: object
 *               properties:
 *                 uploaded:
 *                   type: boolean
 *                 verified:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                   enum: [PENDING, VERIFIED, REJECTED]
 *             pan:
 *               type: object
 *               properties:
 *                 uploaded:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                   enum: [PENDING, VERIFIED, REJECTED]
 *             drivingLicense:
 *               type: object
 *               properties:
 *                 uploaded:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                   enum: [PENDING, VERIFIED, REJECTED]
 *             bankDetails:
 *               type: boolean
 *             overallStatus:
 *               type: string
 *               enum: [INCOMPLETE, PENDING, VERIFIED, REJECTED]
 */

/**
 * @swagger
 * tags:
 *   - name: KYC
 *     description: Know Your Customer (KYC) verification endpoints
 */

/**
 * @swagger
 * /kyc/personal-info:
 *   post:
 *     summary: Submit personal information (Step 1)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonalInfoRequest'
 *     responses:
 *       200:
 *         description: Personal information saved successfully
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
 *                   example: "Personal information saved"
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /kyc/upload-img:
 *   post:
 *     summary: Upload profile image
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (max 5MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *       400:
 *         description: File too large or invalid format
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /kyc/update-nominee:
 *   post:
 *     summary: Update nominee details
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NomineeRequest'
 *     responses:
 *       200:
 *         description: Nominee details updated successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /kyc/aadhar-upload:
 *   post:
 *     summary: Upload Aadhar card (Step 2)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - aadhar
 *             properties:
 *               aadhar:
 *                 type: string
 *                 format: binary
 *                 description: Aadhar card image (max 5MB)
 *     responses:
 *       200:
 *         description: Aadhar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     aadharUrl:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /kyc/aadhar-verify:
 *   post:
 *     summary: Verify Aadhar with Cashfree (Step 2)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AadharVerifyRequest'
 *     responses:
 *       200:
 *         description: Aadhar verification initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Verification failed
 */

/**
 * @swagger
 * /kyc/pan-upload:
 *   post:
 *     summary: Upload PAN card (Step 3)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pan
 *             properties:
 *               pan:
 *                 type: string
 *                 format: binary
 *                 description: PAN card image (max 5MB)
 *     responses:
 *       200:
 *         description: PAN uploaded successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /kyc/dl-upload:
 *   post:
 *     summary: Upload Driving License (Step 4)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - drivingLicense
 *             properties:
 *               drivingLicense:
 *                 type: string
 *                 format: binary
 *                 description: Driving License image (max 5MB)
 *     responses:
 *       200:
 *         description: Driving License uploaded successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /kyc/bank-details:
 *   post:
 *     summary: Submit bank details (Step 5)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - accountHolderName
 *               - accountNumber
 *               - ifscCode
 *               - bankName
 *             properties:
 *               accountHolderName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               ifscCode:
 *                 type: string
 *               bankName:
 *                 type: string
 *               branchName:
 *                 type: string
 *               bankPassbook:
 *                 type: string
 *                 format: binary
 *                 description: Bank passbook/cancelled cheque image
 *     responses:
 *       200:
 *         description: Bank details submitted successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /kyc/update/{id}:
 *   patch:
 *     summary: Update KYC document status (Admin only)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User MongoDB ObjectId
 *       - in: query
 *         name: aadhar
 *         schema:
 *           type: boolean
 *         description: Update Aadhar status
 *       - in: query
 *         name: pan
 *         schema:
 *           type: boolean
 *         description: Update PAN status
 *       - in: query
 *         name: dl
 *         schema:
 *           type: boolean
 *         description: Update Driving License status
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [VERIFIED, REJECTED, PENDING]
 *         description: New status for the document
 *         example: "VERIFIED"
 *     responses:
 *       200:
 *         description: KYC status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /kyc/kyc-status:
 *   get:
 *     summary: Get current user's KYC status
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KYCStatus'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /kyc/get-kyc-data:
 *   get:
 *     summary: Get current user's complete KYC data
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
