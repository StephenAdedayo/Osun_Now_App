/**
 * @swagger
 * tags:
 *   name: User
 *   description: Set up User account and get user data
 */

/**
 * @swagger
 * /api/v1/user/setup-account:
 *   post:
 *     summary: Set up user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []       # 🔹 THIS ADDS TOKEN HEADER
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phone
 *               - gender
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               middleName:
 *                 type: string
 *                 example: Doe
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1999-05-20
 *               occupation:
 *                 type: string
 *                 example: Software Developer
 *               gender:
 *                 type: string
 *                 example: Male
 *               nin:
 *                 type: string
 *                 example: 12345678901
 *               phone:
 *                 type: string
 *                 example: "08143184639"
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               address:
 *                 type: string
 *                 example: 12 Allen Avenue
 *               city:
 *                 type: string
 *                 example: Ikeja
 *               lga:
 *                 type: string
 *                 example: Ikeja LGA
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Account setup successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */



/**
 * @swagger
 * /api/v1/user/getUserData:
 *   get:
 *     summary: Get user data
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
