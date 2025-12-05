const BaseController = require('../../base/BaseController');
const vCarService = require('../../services/vendor/vehicle.service');
const httpStatus = require('http-status');

/**
 * Vendor Car Controller
 * Handles all vendor car-related operations
 * Follows SOLID principles: Single Responsibility Principle
 */
class VendorCarController extends BaseController {
  /**
   * Register new Vehicle
   * @swagger
   * /api/vendor/vehicle/newVehicle:
   *   post:
   *     summary: Register a new Vehicle
   *     tags: [Vendor - Vehicle]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Vehicle registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   */
  newVehicleRegistration = this.asyncHandler(async (req, res) => {
    const result = await vCarService.registerNewVehicle(req.body);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Get inactive car list
   * @swagger
   * /api/vendor/car/inactivelist:
   *   get:
   *     summary: Get list of inactive cars
   *     tags: [Vendor - Car]
   *     responses:
   *       200:
   *         description: List of inactive cars
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   */
  inactiveCarList = this.asyncHandler(async (req, res) => {
    const result = await vCarService.getInactiveVendorCarList();
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Activate vendor car
   * @swagger
   * /api/vendor/car/activate/{carNo}:
   *   put:
   *     summary: Activate a vendor car
   *     tags: [Vendor - Car]
   *     parameters:
   *       - in: path
   *         name: carNo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Car activated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  activateVendorCar = this.asyncHandler(async (req, res) => {
    const { carNo } = req.params;

    this.validateRequired({ carNo }, ['carNo']);

    const result = await vCarService.activateVendorCar(carNo);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Deactivate vendor car
   * @swagger
   * /api/vendor/car/deactivate/{carNo}:
   *   put:
   *     summary: Deactivate a vendor car
   *     tags: [Vendor - Car]
   *     parameters:
   *       - in: path
   *         name: carNo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Car deactivated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  deactivateVendorCar = this.asyncHandler(async (req, res) => {
    const { carNo } = req.params;

    this.validateRequired({ carNo }, ['carNo']);

    const result = await vCarService.deactivateThisVendorCar(carNo);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

  /**
   * Get Vehicle by ID
   * @swagger
   * /api/vendor/vehicle/getVehicleById/{vehicleId}:
   *   get:
   *     summary: Get vehicle details by vehicle ID
   *     tags: [Vendor - Vehicle]
   *     parameters:
   *       - in: path
   *         name: vehicleId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Vehicle details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Success'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  getVehicleById = this.asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;
    this.validateRequired({ vehicleId }, ['vehicleId']);
    const result = await vCarService.getVehicleDetailsById(vehicleId);
    return this.sendSuccess(res, result.data, httpStatus.OK, result.message);
  });

}

// Export singleton instance
module.exports = new VendorCarController();
