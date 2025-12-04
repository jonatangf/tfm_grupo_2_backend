const { validationResult } = require("express-validator");
const {
  createReview,
  getUserReviews
} = require("../services/reviews.service");

const log = (...args) => console.log("[ReviewsController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const reviewsController = {
	createForTrip: async (req, res) => {
		handleValidation(req);
		const userId = req.user?.userId;
		if (!userId) {
			const err = new Error("Usuario no autenticado");
			err.status = 401;
			throw err;
		}

		const tripId = Number(req.params.tripId);
		const { toUserId, score, title, comment } = req.body;

		log("Create review requested", {
			users_id: userId,
			trips_id: tripId,
			reviewed_user_id: toUserId
		});

		// Map frontend fields to database fields
		const reviewData = {
			users_id: userId,
			trips_id: tripId,
			reviewed_user_id: toUserId,
			title: title || "",
			review: comment,
			score
		};

		await createReview(reviewData);
		res.status(201).json({ success: true });
	},

	getUserReviewsList: async (req, res) => {
		handleValidation(req);
		const userId = Number(req.params.userId);
		log("Get user reviews requested", { userId });
		const reviews = await getUserReviews(userId);

		// Map database fields to frontend format
		const formattedReviews = reviews.map(review => ({
			from: review.from_user,
			score: review.score,
			title: review.title,
			comment: review.comment
		}));

		res.json(formattedReviews);
	}
};

module.exports = reviewsController;
