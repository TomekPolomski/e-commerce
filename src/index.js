import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import i18next from 'i18next';
import backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

const app = express();
const PORT = process.env.PORT || 8080;
const API = process.env.API;

// setup of localization
i18next
	.use(backend)
	.use(middleware.LanguageDetector)
	.init({
		fallbackLng: 'en',
		backend: {
			loadPath: 'locales/{{lng}}.json',
		},
	});

// middlewares
app.use(middleware.handle(i18next));

app.get(`${API}/health`, (req, res) => {
	res.send(req.t('accessDeniedOwnOrdersOnly'));
});

// connect DB
try {
	await mongoose.connect(process.env.MONGO_URL);
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}${API}✅`);
		console.log('Connected to MongoDB successfully ^_^');
	});
} catch (error) {
	console.log(error, 'Something went wrong ❌');
	process.exit(1);
}
