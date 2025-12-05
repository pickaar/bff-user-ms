const db = require('../../../models/index');
const { toObjectId } = require('../../../utils/mongoos');
const BaseService = require('../../base/BaseService');
const APIError = require('../../../utils/APIError');
const httpStatus = require('http-status');
const { processFeedbackData } = require('../../../utils/helper');
class FeedbackService extends BaseService {
    /**
     * @description Create a new feedback entry
     * @param {object} feedbackData - The data for the feedback
     * @returns {Promise<Feedback>}
     */
    async createFeedback(feedbackData) {
        try {
            //step 1: check if vendorId and customerId are already existing in the database
            feedbackData.vendorId = toObjectId(feedbackData.vendorId);
            feedbackData.customerId = toObjectId(feedbackData.customerId);
            feedbackData.bookingId = toObjectId(feedbackData.bookingId);
            const existingFeedback = await db.vendor_feedback.findOne({
                vendorId: feedbackData.vendorId,
                customerId: feedbackData.customerId
            }).exec();

            if (existingFeedback) {
                throw new APIError({
                    message: 'Feedback from this customer to this vendor already exists.',
                    status: httpStatus.BAD_REQUEST,
                });
            }

            //step 2: create new feedback entry
            const newFeedback = await db.vendor_feedback.create(feedbackData);
            return newFeedback;
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            this.handleDatabaseError(error);
        }
    }

    /**
     * @description Get feedback entries for a specific vendor
     * @param {string} vendorId - The ID of the vendor
     * @returns {Promise<Feedback[]>}
     */
    async getFeedbackByVendor(vendorId) {
        try {
            const vendorObjectId = toObjectId(vendorId);
            const feedbacks = await db.vendor_feedback.find({ vendorId: vendorObjectId }).lean().exec();
            const vendordetails = await db.vendor_user.findOne({ _id: vendorObjectId }).lean().exec();
            if (!vendordetails) {
                throw new APIError({
                    message: 'Vendor not found.',
                    status: httpStatus.NOT_FOUND,
                });
            }
            // 2. Process feedback array
            const processedData = processFeedbackData(feedbacks);

            // 3. Construct the FINAL response object (matching the target structure)
            const finalFeedbackObject = {
                userInfo: {
                    name: vendordetails.name,
                    exp: vendordetails.exp,
                    language: vendordetails.languagesKnown,
                    completedTrip: vendordetails.completedTrip || processedData.totalTrips,
                    badgesScored: processedData.scoredBadgesWithTotal.length,
                    aboutMe: vendordetails.aboutUs || "Passionate about driving and safety.",
                    profileImgSrc: vendordetails.profileImgSrc || "../../../../assets/driver_avatar.png"
                },
                ratings: {
                    rating: processedData.avgRating, 
                    completedTrip: processedData.totalTrips,
                    ratingForEach: processedData.ratingCounts,
                },
                scoredBadgesWithTotal: processedData.scoredBadgesWithTotal,
                feedbacks: processedData.totalFeedbacks
            };

            // console.log('Final Feedback Object:', finalFeedbackObject);
            return {
                status: 200,
                message: 'Feedback retrieved successfully',
                data: finalFeedbackObject,
            };
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            this.handleDatabaseError(error);
        }
    }
}

module.exports = new FeedbackService();