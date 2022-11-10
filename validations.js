import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'Not correct email').isEmail(),
  body('password', 'Password length must be 5 or more').isLength({ min: 5 }),
  body('fullName', 'Full name length must be 3 or more').isLength({ min: 3 }),
  body('avatarUrl','Not correct URL').optional().isURL(),
]

export const loginValidation = [
  body('email', 'Not correct email').isEmail(),
  body('password', 'Password length must be 5 or more').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Title length must be 3 or more').isLength({ min: 3 }).isString(),
  body('text', 'Text length must be 10 or more').isLength({ min: 10 }).isString(),
  body('tags').optional().isString(),
  body('imageUrl').optional().isString()
]