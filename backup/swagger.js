// when i use post to fetch data
/**
 * @swagger
 * /api/v1/user/getUserData:
 *   post:
 *     summary: Get user data
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}   # empty object, no fields required
 *     responses:
 *       200:
 *         description: User data fetched successfully
 *       401:
 *         description: Unauthorized
 */
