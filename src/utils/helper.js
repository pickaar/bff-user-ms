/**
 * Processes raw feedback documents to calculate ratings and badge counts.
 * * @param {Array<Object>} feedbacks - Raw feedback documents for the vendor.
 * @returns {Object} Calculated ratings and structured badge data.
 */
const processFeedbackData = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) {
        return {
            totalTrips: 0,
            avgRating: 0,
            ratingCounts: [0, 0, 0, 0, 0], // [5, 4, 3, 2, 1 star counts]
            badgeFrequencies: {},
            totalFeedbacks: []
        };
    }

    let totalRatingSum = 0;
    const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 5 stars, Index 4 = 1 star
    const badgeFrequencies = {};
    const totalTrips = feedbacks.length;
    
    // Structure simple feedback list for display
    const totalFeedbacks = feedbacks.map(f => ({
        reviewerName: f.reviewerName,
        starRating: f.starRating,
        comments: f.comments,
        createdAt: f.createdAt,
        scoredBadges: f.scoredBadges || []
    }));

    // 1. Calculate Ratings and Frequencies
    for (const feedback of feedbacks) {
        const rating = feedback.starRating;
        if (rating >= 1 && rating <= 5) {
            totalRatingSum += rating;
            // Map rating (5 down to 1) to array index (0 up to 4)
            ratingCounts[5 - rating]++;
        }

        // 2. Count Badge Occurrences
        if (feedback.scoredBadges && Array.isArray(feedback.scoredBadges)) {
            for (const badge of feedback.scoredBadges) {
                badgeFrequencies[badge] = (badgeFrequencies[badge] || 0) + 1;
            }
        }
    }

    const avgRating = totalTrips > 0 ? parseFloat((totalRatingSum / totalTrips).toFixed(1)) : 0;
    
    // 3. Structure Badges with Percentage (Example: "Women Safe 80%")
    const scoredBadgesWithTotal = Object.entries(badgeFrequencies).map(([badgeName, count]) => {
        // Calculate percentage: (Count of badge / Total trips) * 100
        const percentage = Math.round((count / totalTrips) * 100);
        return `${badgeName} ${percentage}%`;
    });

    return {
        totalTrips,
        avgRating,
        ratingCounts,
        scoredBadgesWithTotal,
        totalFeedbacks
    };
};

module.exports = { processFeedbackData };