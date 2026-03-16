/**
 * Transactions API Documentation
 * 
 * This file contains Swagger documentation for Transaction related endpoints.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentDetails:
 *       type: object
 *       properties:
 *         paymentMethod:
 *           type: string
 *           enum: [WALLET, CARD, UPI, NET_BANKING, CASH, ONLINE]
 *           example: "UPI"
 *         paymentGateway:
 *           type: string
 *           enum: [RAZORPAY, PAYU, STRIPE, PHONEPE, JUSPAY]
 *           example: "JUSPAY"
 *         gatewayTransactionId:
 *           type: string
 *           example: "gw_txn_123456"
 *         gatewayResponse:
 *           type: object
 *           description: Full response from payment gateway
 *         cardDetails:
 *           type: object
 *           properties:
 *             maskedCardNumber:
 *               type: string
 *               example: "XXXX-XXXX-XXXX-1234"
 *             cardType:
 *               type: string
 *               enum: [CREDIT, DEBIT]
 *               example: "CREDIT"
 *             bankName:
 *               type: string
 *               example: "HDFC Bank"
 *         upiDetails:
 *           type: object
 *           properties:
 *             vpa:
 *               type: string
 *               example: "user@paytm"
 *             refNumber:
 *               type: string
 *               example: "123456789012"
 *     
 *     WalletInfo:
 *       type: object
 *       properties:
 *         beforeBalance:
 *           type: number
 *           example: 1000
 *         afterBalance:
 *           type: number
 *           example: 500
 *         isWalletTransaction:
 *           type: boolean
 *           example: true
 *     
 *     Fees:
 *       type: object
 *       properties:
 *         platformFee:
 *           type: number
 *           example: 10
 *         processingFee:
 *           type: number
 *           example: 5
 *         gst:
 *           type: number
 *           example: 2.7
 *         totalFees:
 *           type: number
 *           example: 17.7
 *     
 *     RefundInfo:
 *       type: object
 *       properties:
 *         refundAmount:
 *           type: number
 *           example: 500
 *         refundReason:
 *           type: string
 *           example: "Customer request"
 *         refundStatus:
 *           type: string
 *           enum: [PENDING, PROCESSED, FAILED]
 *           example: "PROCESSED"
 *         refundDate:
 *           type: string
 *           format: date-time
 *         refundReference:
 *           type: string
 *           example: "REF123456"
 *     
 *     InvoiceInfo:
 *       type: object
 *       properties:
 *         invoiceNumber:
 *           type: string
 *           example: "INV-2026-001"
 *         invoiceUrl:
 *           type: string
 *           example: "https://example.com/invoices/INV-2026-001.pdf"
 *         gstNumber:
 *           type: string
 *           example: "29ABCDE1234F1Z5"
 *     
 *     TransactionTimestamps:
 *       type: object
 *       properties:
 *         initiatedAt:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *         failedAt:
 *           type: string
 *           format: date-time
 *         cancelledAt:
 *           type: string
 *           format: date-time
 *     
 *     TransactionMetadata:
 *       type: object
 *       properties:
 *         ipAddress:
 *           type: string
 *           example: "192.168.1.1"
 *         userAgent:
 *           type: string
 *           example: "Mozilla/5.0..."
 *         device:
 *           type: string
 *           enum: [MOBILE, DESKTOP, TABLET]
 *           example: "MOBILE"
 *     
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: "507f1f77bcf86cd799439011"
 *         transactionId:
 *           type: string
 *           description: Unique transaction identifier with txn prefix
 *           example: "txn_abc123"
 *         orderId:
 *           type: string
 *           description: Payment gateway order ID
 *           example: "order_xyz789"
 *         userId:
 *           type: string
 *           description: User ID who initiated the transaction
 *           example: "USR_123"
 *         type:
 *           type: string
 *           enum: [CREDIT, DEBIT]
 *           description: Transaction type
 *           example: "DEBIT"
 *         status:
 *           type: string
 *           enum: [PENDING, ORDER_CREATED, CHARGED, COMPLETED, FAILED, CANCELLED, REFUNDED, AUTHORIZATION_FAILED, AUTHENTICATION_FAILED, PENDING_VBV]
 *           description: Transaction status
 *           example: "CHARGED"
 *         amount:
 *           type: number
 *           description: Transaction amount
 *           example: 500
 *         currency:
 *           type: string
 *           description: Currency code
 *           example: "INR"
 *           default: "INR"
 *         description:
 *           type: string
 *           description: Transaction description
 *           example: "Payment for order #123"
 *         paymentDetails:
 *           $ref: '#/components/schemas/PaymentDetails'
 *         wallet:
 *           $ref: '#/components/schemas/WalletInfo'
 *         fees:
 *           $ref: '#/components/schemas/Fees'
 *         refund:
 *           $ref: '#/components/schemas/RefundInfo'
 *         invoice:
 *           $ref: '#/components/schemas/InvoiceInfo'
 *         timestamps:
 *           $ref: '#/components/schemas/TransactionTimestamps'
 *         metadata:
 *           $ref: '#/components/schemas/TransactionMetadata'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     TransactionListItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         userId:
 *           type: string
 *           example: "USR_123"
 *         transactionId:
 *           type: string
 *           example: "txn_abc123"
 *         orderId:
 *           type: string
 *           example: "order_xyz789"
 *         type:
 *           type: string
 *           enum: [CREDIT, DEBIT]
 *           example: "DEBIT"
 *         status:
 *           type: string
 *           example: "CHARGED"
 *         amount:
 *           type: number
 *           example: 500
 *         currency:
 *           type: string
 *           example: "INR"
 *         description:
 *           type: string
 *           example: "Payment for order #123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *     
 *     InitiatePaymentRequest:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           description: Payment amount in INR
 *           example: 500
 *           minimum: 1
 *         device:
 *           type: string
 *           enum: [MOBILE, DESKTOP, TABLET]
 *           description: Device type (optional, auto-detected from user-agent)
 *           example: "MOBILE"
 *     
 *     PaymentSession:
 *       type: object
 *       properties:
 *         order_id:
 *           type: string
 *           description: Payment gateway order ID
 *           example: "order_xyz789"
 *         payment_links:
 *           type: object
 *           description: Payment gateway specific links and tokens
 *         sdk_payload:
 *           type: object
 *           description: SDK initialization payload
 *         merchant_id:
 *           type: string
 *           description: Merchant identifier
 *     
 *     OrderStatusResponse:
 *       type: object
 *       properties:
 *         order_id:
 *           type: string
 *           example: "order_xyz789"
 *         status:
 *           type: string
 *           enum: [CHARGED, PENDING, PENDING_VBV, AUTHORIZATION_FAILED, AUTHENTICATION_FAILED, CANCELLED]
 *           example: "CHARGED"
 *         amount:
 *           type: number
 *           example: 500
 *         currency:
 *           type: string
 *           example: "INR"
 *         txn_id:
 *           type: string
 *           description: Gateway transaction ID
 *         payment_method:
 *           type: string
 *           example: "UPI"
 *         payment_method_type:
 *           type: string
 *           example: "VPA"
 *     
 *     UpdateTransactionStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, CHARGED, COMPLETED, FAILED, CANCELLED, REFUNDED]
 *           description: New transaction status
 *           example: "COMPLETED"
 */

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Transaction and payment management endpoints
 */

/**
 * @swagger
 * /transactions/initiate-payment:
 *   post:
 *     summary: Initiate a payment session
 *     description: |
 *       Creates a payment order session with the payment gateway (Juspay).
 *       Captures user IP address, user agent, and device information automatically.
 *       Returns payment session details including order ID and payment links.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitiatePaymentRequest'
 *     responses:
 *       200:
 *         description: Payment initiated successfully
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
 *                   example: "Payment initiated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PaymentSession'
 *       400:
 *         description: Bad request - Invalid amount
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/order-status/{orderId}:
 *   get:
 *     summary: Get order status from payment gateway
 *     description: |
 *       Fetch the current status of a payment order from the payment gateway.
 *       Returns detailed order information including payment status and method.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment gateway order ID
 *         example: "order_xyz789"
 *     responses:
 *       200:
 *         description: Order status fetched successfully
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
 *                   example: "order payment done successfully"
 *                 data:
 *                   $ref: '#/components/schemas/OrderStatusResponse'
 *       400:
 *         description: Bad request - Order ID is required
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions with filters
 *     description: |
 *       Retrieve transactions with pagination, search, and sorting capabilities.
 *       Can filter by userId, search across multiple fields, and sort by any field.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *         example: "USR_123"
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
 *         description: Search by transactionId, orderId, description, status, or type
 *         example: "txn_abc"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *         example: "createdAt"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
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
 *                   example: "Transactions fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TransactionListItem'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                       example: 1
 *                     limit:
 *                       type: number
 *                       example: 10
 *                     totalPages:
 *                       type: number
 *                       example: 5
 *                     totalDocuments:
 *                       type: number
 *                       example: 50
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     summary: Get a specific transaction by ID
 *     description: Retrieve complete details of a transaction including all nested objects
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: "txn_abc123"
 *     responses:
 *       200:
 *         description: Transaction fetched successfully
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
 *                   example: "Transaction fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /transactions/update-status/{transactionId}:
 *   put:
 *     summary: Update transaction status
 *     description: |
 *       Update the status of a transaction. 
 *       This is typically used by admin or system processes to manually update transaction status.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: "txn_abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTransactionStatusRequest'
 *     responses:
 *       200:
 *         description: Transaction status updated successfully
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
 *                   example: "Transaction status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
