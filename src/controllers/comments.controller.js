const { validationResult } = require("express-validator");
const {
	insert,
	findById,
	findCommentsByTripId,
	findRepliesByCommentId
} = require("../models/messages.model");

const log = (...args) => console.log("[CommentsController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const commentsController = {
	create: async (req, res) => {
		handleValidation(req);
		const tripId = Number(req.params.tripId);
		const userId = req.user.userId;
		const { title, message } = req.body;

		const fullMessage = title ? `${title}: ${message}` : message;

		log("Create comment requested", { tripId, userId });

		const commentId = await insert({
			message: fullMessage,
			users_id: userId,
			trips_id: tripId,
			messages_id: null
		});

		res.status(201).json({ success: true, commentId });
	},

	list: async (req, res) => {
		handleValidation(req);
		const tripId = Number(req.params.tripId);

		log("List comments requested", { tripId });

		const comments = await findCommentsByTripId(tripId);

		const formatted = comments.map(c => {
			const parts = c.message.split(": ");
			const hasTitle = parts.length > 1;
			return {
				commentId: c.commentId,
				userId: c.userId,
				user: c.user,
				title: hasTitle ? parts[0] : "",
				message: hasTitle ? parts.slice(1).join(": ") : c.message
			};
		});

		res.json(formatted);
	},

	reply: async (req, res) => {
		handleValidation(req);
		const tripId = Number(req.params.tripId);
		const commentId = Number(req.params.commentId);
		const userId = req.user.userId;
		const { message } = req.body;

		log("Reply to comment requested", { tripId, commentId, userId });

		const parentComment = await findById(commentId);
		if (!parentComment) {
			const err = new Error("Comentario no encontrado");
			err.status = 404;
			throw err;
		}

		await insert({
			message,
			users_id: userId,
			trips_id: tripId,
			messages_id: commentId
		});

		res.json({ success: true });
	},

	listReplies: async (req, res) => {
		handleValidation(req);
		const commentId = Number(req.params.commentId);

		log("List replies requested", { commentId });

		const parentComment = await findById(commentId);
		if (!parentComment) {
			const err = new Error("Comentario no encontrado");
			err.status = 404;
			throw err;
		}

		const replies = await findRepliesByCommentId(commentId);

		res.json(replies);
	}
};

module.exports = commentsController;
