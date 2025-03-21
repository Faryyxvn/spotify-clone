import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		artist: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		audioUrl: {
			type: String,
			required: true,
		},
		totalPlays: {
			type: Number,
			default: 0,
		},
		weeklyPlays: {
			type: Number,
			default: 0,
		},
		monthlyPlays: {
			type: Number,
			default: 0,
		},
		yearlyPlays: {
			type: Number,
			default: 0,
		},
		lastPlayed: {
			type: Date,
		},
		duration: {
			type: Number,
			required: true,
		},
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			required: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Create text index for search
songSchema.index({ title: "text", artist: "text" });

export const Song = mongoose.model("Song", songSchema);
