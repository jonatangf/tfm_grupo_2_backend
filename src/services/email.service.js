const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");

const log = (...args) => console.log("[EmailService]", ...args);

const loadTemplate = (templateName, variables = {}) => {
	const templatePath = path.join(__dirname, "../templates", `${templateName}.html`);
	let html = fs.readFileSync(templatePath, "utf8");

	for (const [key, value] of Object.entries(variables)) {
		html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
	}

	return html;
};

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "";

if (SENDGRID_API_KEY) {
	sgMail.setApiKey(SENDGRID_API_KEY);
	log("SendGrid configured");
} else {
	log("Warning: SENDGRID_API_KEY not configured - emails will not be sent");
}

const sendEmail = async ({ to, subject, text, html }) => {
	if (!SENDGRID_API_KEY) {
		log("Email not sent - SENDGRID_API_KEY not configured", { to, subject });
		return { success: false, reason: "SENDGRID_API_KEY not configured" };
	}

	if (!SENDGRID_FROM_EMAIL) {
		log("Email not sent - SENDGRID_FROM_EMAIL not configured", { to, subject });
		return { success: false, reason: "SENDGRID_FROM_EMAIL not configured" };
	}

	const msg = {
		to,
		from: SENDGRID_FROM_EMAIL,
		subject,
		text,
		html
	};

	try {
		log("Sending email", { to, subject });
		await sgMail.send(msg);
		log("Email sent successfully", { to, subject });
		return { success: true };
	} catch (error) {
		log("Error sending email", { to, subject, error: error.message });
		throw error;
	}
};

const sendWelcomeEmail = async (to, userName) => {
	const html = loadTemplate("welcome", { userName, email: to });

	return sendEmail({
		to,
		subject: "Bienvenido a Trips",
		text: `Hola ${userName}, bienvenido a Trips! Estamos encantados de tenerte con nosotros. Ahora puedes empezar a planificar tus viajes, conectar con otros viajeros y descubrir nuevos destinos.`,
		html
	});
};

const sendTripAcceptedEmail = async (to, { userName, tripName, startDate, endDate, destination }) => {
	const html = loadTemplate("trip-accepted", { userName, tripName, startDate, endDate, destination, email: to });

	return sendEmail({
		to,
		subject: `Has sido aceptado en el viaje "${tripName}"`,
		text: `Hola ${userName}, has sido aceptado en el viaje "${tripName}" a ${destination}. El viaje es del ${startDate} al ${endDate}. Prepara tus maletas!`,
		html
	});
};

module.exports = {
	sendEmail,
	sendWelcomeEmail,
	sendTripAcceptedEmail
};