import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
	try {
		const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
			Song.countDocuments(),
			Album.countDocuments(),
			User.countDocuments(),

			Song.aggregate([
				{
					$unionWith: {
						coll: "albums",
						pipeline: [],
					},
				},
				{
					$group: {
						_id: "$artist",
					},
				},
				{
					$count: "count",
				},
			]),
		]);

		res.status(200).json({
			totalAlbums,
			totalSongs,
			totalUsers,
			totalArtists: uniqueArtists[0]?.count || 0,
		});
	} catch (error) {
		next(error);
	}
};

export const getPlayStats = async (req, res, next) => {
	try {
		const stats = await Song.aggregate([
			{
				$group: {
					_id: null,
					totalPlays: { $sum: "$totalPlays" },
					weeklyPlays: { $sum: "$weeklyPlays" },
					monthlyPlays: { $sum: "$monthlyPlays" },
					yearlyPlays: { $sum: "$yearlyPlays" }
				}
			}
		]);

		res.status(200).json({
			totalPlays: stats[0]?.totalPlays || 0,
			weeklyPlays: stats[0]?.weeklyPlays || 0,
			monthlyPlays: stats[0]?.monthlyPlays || 0,
			yearlyPlays: stats[0]?.yearlyPlays || 0
		});
	} catch (error) {
		next(error);
	}
};

