import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
	try {
		// -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		// fetch 6 random songs using mongodb's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const searchSongs = async (req, res, next) => {
	try {
		const { query } = req.query;

		if (!query || query.trim() === "") {
			return res.status(400).json({ message: "Search query is required" });
		}

		const songs = await Song.find(
			{ $text: { $search: query } },
			{ score: { $meta: "textScore" } }
		).sort({ score: { $meta: "textScore" } });

		res.json(songs);
	} catch (error) {
		next(error);
	}
};


export const incrementPlayCount = async (req, res, next) => {
	try {
		const { id } = req.params;

		const currentDate = new Date();
		
		const update = {
			$inc: {
				totalPlays: 1,
				weeklyPlays: 1,
				monthlyPlays: 1,
				yearlyPlays: 1
			},
			$set: {
				lastPlayed: currentDate
			}
		};

		const result = await Song.updateOne(
			{ _id: id },
			update
		);

		if (result.matchedCount === 0) {
			return res.status(404).json({ message: "Song not found" });
		}

		res.json({
			success: true,
			message: "Play count updated",
			totalPlays: result.totalPlays // Note: Would need to fetch updated doc for accurate count
		});
	} catch (error) {
		next(error);
	}
};

