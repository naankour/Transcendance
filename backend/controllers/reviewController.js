const prisma = require('../prisma/prismaClient');

const getReviews = async (req, res) => 
{
  try 
  {
    const reviews = await prisma.reviews.findMany()
    res.json(reviews)
  } 
  catch (error) 
  {
    res.status(500).json({ error: error.message })
  }
}

const getReviewsByMovie = async(req, res) =>
{
    try
    {
      const movie_id = parseInt(req.params.movie_id);

      const movieReviews = await prisma.reviews.findMany({
        where: {
          movie_id
        }
      });
      res.json(movieReviews);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}

const createReview = async(req, res) =>
{
  try
  {
    const movie_id = parseInt(req.body.movie_id);
    const rating = parseFloat(req.body.rating);
    const content = req.body.content;
    const user_id = req.user.id;

    if (isNaN(rating) || !content)
    {
      return res.status(400).json({
        error: "rating and content are mandatory"
      });
    }

    if (rating < 0.5 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 0,5 and 5"
      });
    }

    const newReview = await prisma.reviews.create(
    {
      data: {
        movie_id,
        user_id,
        rating,
        content,
      },
    });
    return res.status(201).json(newReview);
  }
  catch (error)
  {
    return res.status(500).json({ error: error.message })
  }
};

const updateReview = async(req, res) =>
{
  try
  {
    const review_id = parseInt(req.params.id);
    const rating = parseFloat(req.body.rating);
    const content = req.body.content;
    const user_id = req.user.id;

    if (isNaN(rating) || !content)
    {
      return res.status(400).json({
        error: "rating and content are mandatory"
      });
    }

    if (rating < 0.5 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 0,5 and 5"
      });
    }

    const review = await prisma.reviews.findFirst({
      where: {
        id: review_id,
        user_id: user_id
      }
    });

    if (!review)
    {
      return res.status(404).json({
        error: "Review not found or unauthorized"
      });
    }

    const updatedReview = await prisma.reviews.update(
    {
      where: {
        id: review_id,
      },
      data: {
        rating,
        content
      }
    });
    return res.status(200).json(updatedReview);
  }
  catch (error)
  {
    return res.status(500).json({ error: error.message })
  }
};

const deleteReview = async(req, res) =>
{
  try
  {
    const review_id = parseInt(req.params.id);
    const user_id = req.user.id;

    const review = await prisma.reviews.findFirst({
      where: {
        id: review_id,
        user_id: user_id
      }
    });

    if (!review) {
      return res.status(404).json({
        error: "Review not found or unauthorized"
      });
    }

    const deletedReview = await prisma.reviews.delete({
      where: {
        id: review_id
      }
    });
    return res.status(200).json(deletedReview);
  }
  catch (error)
  {
    return res.status(500).json({
      error: error.message
    });
  }
};

module.exports = { getReviews, getReviewsByMovie, createReview, updateReview, deleteReview }