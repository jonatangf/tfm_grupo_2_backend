const { validationResult } = require("express-validator");
const {
	listReviews,
	getReview,
	createReview,
	updateReview,
	deleteReview
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
	list: async (req, res) => {
		const limit = Number(req.query.limit || 50);
		const offset = Number(req.query.offset || 0);
		log("List requested", { limit, offset });
		const data = await listReviews({ limit, offset });
		res.json({ data, limit, offset });
	},

	get: async (req, res) => {
		const usersId = Number(req.params.usersId);
		const tripsId = Number(req.params.tripsId);
		const reviewedUserId = Number(req.params.reviewedUserId);
		log("Get requested", { usersId, tripsId, reviewedUserId });
		const review = await getReview(usersId, tripsId, reviewedUserId);
		res.json(review);
	},

	create: async (req, res) => {
		handleValidation(req);
		log("Create requested", {
			users_id: req.body.users_id,
			trips_id: req.body.trips_id,
			reviewed_user_id: req.body.reviewed_user_id
		});
		const review = await createReview(req.body);
		res.status(201).json(review);
	},

	update: async (req, res) => {
		handleValidation(req);
		const usersId = Number(req.params.usersId);
		const tripsId = Number(req.params.tripsId);
		const reviewedUserId = Number(req.params.reviewedUserId);
		log("Update requested", { usersId, tripsId, reviewedUserId });
		const review = await updateReview(usersId, tripsId, reviewedUserId, req.body);
		res.json(review);
	},

	remove: async (req, res) => {
		const usersId = Number(req.params.usersId);
		const tripsId = Number(req.params.tripsId);
		const reviewedUserId = Number(req.params.reviewedUserId);
		log("Delete requested", { usersId, tripsId, reviewedUserId });
		const result = await deleteReview(usersId, tripsId, reviewedUserId);
		res.json(result);
	}
};

module.exports = reviewsController;
