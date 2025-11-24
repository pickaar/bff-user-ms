const BaseController = require('../../base/BaseController');
const rideService = require('../../services/customer/rides.service');
const httpStatus = require('http-status');

/**
 * Customer Rides Controller
 * Handles all customer ride-related operations
 * Follows SOLID principles: Single Responsibility Principle
 */
class CustomerRidesController extends BaseController {
  /**
   * Save new ride
   * @swagger
   * /api/cust/rides:
   *   post:
   *     summary: Save a new ride
   *     tags: [Customer - Rides]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - bookingId
   *               - userId
   *             properties:
   *               bookingId:
   *                 type: string
   *               userId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Ride saved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  saveNewRide = this.asyncHandler(async (req, res) => {
    this.validateRequired(req.body, ['bookingId', 'userId']);
    
    const result = await rideService.saveNewRides(req.body);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });
}

// Export singleton instance
module.exports = new CustomerRidesController();