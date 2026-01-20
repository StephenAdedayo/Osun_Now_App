/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and password management
 */

/**
 * @swagger
 * /api/v1/auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: number
 *                 example: 08143184639
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/auth/sign-in:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: number
 *                 example: 08143184639
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/auth/verify:
 *   post:
 *     summary: Verify authenticated user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: number
 *                 example: 08143184639
 *               otp:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: User authenticated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/auth/send-otp:
 *   post:
 *     summary: Send password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: number
 *                 example: 8143184639
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */

/**
 * @swagger
 * /api/v1/auth/verify-reset-otp:
 *   post:
 *     summary: Verify password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: number
 *                 example: 8143184639
 *               otp:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: number
 *                 example: 8143184639
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 */
