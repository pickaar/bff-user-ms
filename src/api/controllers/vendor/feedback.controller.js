const FeedbackService = require('../../services/vendor/feedback.service');
const BaseController = require('../../base/BaseController');

class FeedbackController extends BaseController {

    /**
     * Create new feedback
     * @swagger
     * /api/vendor/feedback/create:
     *   post:
     *     summary: Create a new feedback
     *     tags: [Vendor - Feedback]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - vendorId
     *               - customerId
     *               - starRating
     *             properties:
     *               vendorId:
     *                 type: string
     *                 description: The ID of the vendor receiving the feedback.
     *               customerId:
     *                 type: string
     *                 description: The ID of the customer giving the feedback.
     *               bookingId:
     *                 type: string
     *                 description: The ID of the booking related to the feedback.
     *               profileImgSrc:
     *                 type: string
     *                 description: URL for the reviewer's profile image.
     *                 default: '../../../../assets/customer_avatar.png'
     *               reviewerName:
     *                 type: string
     *                 description: Name of the reviewer.
     *                 default: 'Anonymous'
     *               starRating:
     *                 type: number
     *                 minimum: 1
     *                 maximum: 5
     *                 description: A rating from 1 to 5.
     *               comments:
     *                 type: string
     *                 description: Text comments for the feedback.
     *               scoredBadges:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: A list of badges scored.
     *             example:
     *               vendorId: "60d0fe4f5311236168a109ca"
     *               customerId: "60d0fe4f5311236168a109cb"
     *               reviewerName: "John Doe"
     *               starRating: 4
     *               comments: "Great service and fast delivery."
     *               scoredBadges: ["on-time", "quality-product"]
     *     responses:
     *       201:
     *         description: Feedback created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Success'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     */
    createFeedback = this.asyncHandler(async (req, res) => {
        const result = await FeedbackService.createFeedback(req.body);
        this.sendSuccess(res, result.data, result.status, result.message);
    });

    /**
     * Get feedback by vendor
     * @swagger
     * /api/vendor/feedback/getFeedbackById/{vendorId}:
     *   get:
     *     summary: Get feedback by vendor ID
     *     tags: [Vendor - Feedback]
     *     parameters:
     *       - in: path
     *         name: vendorId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the vendor to retrieve feedback for
     *     responses:
     *       200:
     *         description: Feedback retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/VendorFeedback'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     */
    getFeedbackByVendor = this.asyncHandler(async (req, res) => {
        console.log('Received request to get feedback for vendor ID:', req.params.vendorId);
        const vendorId = req.params.vendorId;
        const result = await FeedbackService.getFeedbackByVendor(vendorId);
        this.sendSuccess(res, result.data, result.status, result.message);
    });
}

module.exports = new FeedbackController();