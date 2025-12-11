const { validationResult } = require("express-validator");
const {
	getUser,
	updateUser
} = require("../services/users.service");

const fs = require ('node:fs');
const log = (...args) => console.log("[UsersController]", ...args);

const handleValidation = (req) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new Error(errors.array().map((e) => e.msg).join(", "));
		err.status = 400;
		throw err;
	}
};

const usersController = {
	get: async (req, res) => {
		const id = Number(req.params.userId);
		log("Get user", { id });
		const user = await getUser(id);
		res.json(user);
	},

	update: async (req, res) => {
		handleValidation(req);
		const id = Number(req.params.userId);
		log("Update user", { id });
		await updateUser(id, req.body);
		res.json({ success: true });
	},

	getScore: async (req, res) => {
		const id = Number(req.params.userId);
		log("Get user score", { id });
		const user = await getUser(id);
		res.json({ averageScore: user.avg_rating || 0 });
	},

	updateAvatar: async (req, res) => {		
		handleValidation(req);
		const userId = req.user.userId;
		const extension = req.file.mimetype.split("/")[1];
		const newFilename = `${userId}.${extension}`;
		const avatarsDir = 'public/avatars';
		
		// Create avatars directory if it doesn't exist
		if (!fs.existsSync(avatarsDir)) {
			fs.mkdirSync(avatarsDir, { recursive: true });
		}
		
		// Delete existing avatar files for this user (any extension)
		const existingFiles = fs.readdirSync(avatarsDir);
		for (const file of existingFiles) {
			if (file.startsWith(`${userId}.`)) {
				fs.unlinkSync(`${avatarsDir}/${file}`);
			}
		}
		
		fs.renameSync(req.file.path, `${avatarsDir}/${newFilename}`);
		const avatarUrl = `/avatars/${newFilename}`;
		log("Update user avatar", { userId, avatarUrl, extension, newFilename });
		await updateUser(userId, { avatar: avatarUrl });
		res.json({ success: true, avatar: avatarUrl });
	}
};

module.exports = usersController;
