const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// Define the schema
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'CyberSecurity',
        'Linux',
        'Server',
        'Networking',
        'Programming',
        'WebDevelopment',
        'DevOps',
        'Uncategorized',
      ],
      message: '{VALUE is not supported',
    },

    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },

    thumbnail: { type: String, required: true },
  },
  { timestamps: true }
); // Adding timestamps for createdAt and updatedAt

// Create and export the model
const Post = model('Post', postSchema);
module.exports = Post;
