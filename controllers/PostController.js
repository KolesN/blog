import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts.map(({ tags }) => tags).flat().slice(0, 5)
    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Got no tags'
    })
  }
}

export const getLastComments = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const comments = posts.map(({ comments }) => comments).flat().slice(0, 5)
    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Got no tags'
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    res.json(posts)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Could not get posts'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndUpdate({
      _id: postId
    },
    {
      $inc: { viewCount: 1 }
    },
    {
      returnDocument: 'after'
    },
    (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Could not get post'
        })
      }

      if (!doc) {
        return res.status(404).json({
          message: 'No such post'
        })
      }

      res.json(doc)
    }).populate('user')
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Could not get posts",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      id: postId
    }, (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Could not delete post'
        })
      }

      if (!doc) {
        return res.status(404).json({
          message: 'Post not found'
        })
      }

      res.json({
        message: 'Success'
      })
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Could not get posts",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { body } = req
    const doc = new PostModel({
      title: body.title,
      text: body.text,
      imageUrl: body.imageUrl,
      tags: body.tags.split(','),
      user: req.userId
    })

    const post = await doc.save()
    res.json(post)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Unable to create post'
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id
    const { body } = req

    await PostModel.updateOne({
      _id: postId
    }, {
      title: body.title,
      text: body.text,
      imageUrl: body.imageUrl,
      user: req.userId,
      tags: body.tags.split(',')
    })

    res.json({
      message: 'Success'
    })
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: 'Could not update'
    })
  }
}