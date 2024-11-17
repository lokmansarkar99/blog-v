const brcypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fs = require('fs')
const { v4: uuid } = require('uuid')
const path = require('path');


const UserModel = require('../models/UserModel');
const HttpError = require('../models/errorModel');
const User = require('../models/UserModel');

// ==== REGISTER A NEW USER
// POST : api/users/register
// UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError('Fill in the fields.', 422));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await UserModel.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError('Email already exists.', 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError('Passwords should be at least 6 characters.', 422)
      );
    }

    if (password !== password2) {
      return next(new HttpError('Passwords do not match.', 422));
    }
    const salt = await brcypt.genSalt(10)
    const hashedPass = await brcypt.hash(password, salt)
    const newUser = await User.create({ name, email: newEmail, password: hashedPass })
    res.status(201).json(`New User ${newUser.email} registerd`)

  } catch (error) {
    return next(new HttpError('User registration failed.', 422));
  }
};

// ==== LOGIN A REGISTERED USER
// POST : api/users/login
// UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const {email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill in all fields", 422))
    }
    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail })
    if (!user) {
      return next(new HttpError("Invalid credentials", 422))

    }
    const comparePass = await brcypt.compare(password, user.password)
    if (!comparePass) {
      return next(new HttpError("Invalid Credentials.", 422))
    }

    const { _id: id, name } = user
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.status(200).json({token, id, name})

  } catch (error) {
    return next(new HttpError("Login failed. Please check your credentials", 422))
    
  }
};

// ==== USER PROFILE
// GET: api/users/:id
// PROTECTED
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params 
    const user = await User.findById(id).select('-password')
    if (!user) {
      return next(new HttpError("User not found"), 404)
    }
    res.status(200).json(user)
  } catch (error) {
    return next(new HttpError(error))
  }
};

// ==== CHANGE USER AVATAR
// POST : api/users/change-avatar
// PROTECTED
// const changeAvatar = async (req, res, next) => {
//  try {
//    if (!req.files.avatar) {
//      return next(new HttpError("Please choose an image", 422))
//    }

//    // find user from database
//    const user = await User.findById(req.user.id)
   
//    // delete old avatar if exist
//    if (user.avatar) {
//      fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
//        if (err) {
//          return next(new HttpError(err))
//        }
       
//      })
//    }

//    const { avatar } = req.files;
//    //check file size
//    if (avatar.size > 500000) {
//      return next(new HttpError("Profile picture too big. Should be less than 500kb", 422))
//    }
//    let fileName = avatar.name
//    let spilletdFilename = fileName.split('.')
//    let newFileName = spilletdFilename[0] + uuid() + '.' + spilletdFilename[spilletdFilename.length - 1]
//    avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), (err) => {
//      if (err) {
//        return next(new HttpError(err))
//      }
//      const updatedAvatar = User.findByIdAndUpdate(req.user.id, { avatar: newFileName }, { new: true })
//      if (!updatedAvatar) {
//        return next(new HttpError("Avatar couldn't be changed.", 422))
//      }
//      res.status(200).json(updatedAvatar)

     
//    })

//  } catch (error) {
//   return next(new HttpError(error))
//  }
// };

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError('Please choose an image', 422));
    }

    const user = await User.findById(req.user.id);

    if (user.avatar) {
      fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), err => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    const { avatar } = req.files;
    if (avatar.size > 500000) {
      return next(
        new HttpError('Profile picture too big. Should be less than 500kb', 422)
      );
    }

    let fileName = avatar.name;
    let spilletdFilename = fileName.split('.');
    let newFileName =
      spilletdFilename[0] +
      uuid() +
      '.' +
      spilletdFilename[spilletdFilename.length - 1];

    avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async err => {
      if (err) {
        return next(new HttpError(err));
      }

      const updatedAvatar = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: newFileName },
        { new: true }
      ).lean();
      if (!updatedAvatar) {
        return next(new HttpError("Avatar couldn't be changed.", 422));
      }
      res.status(200).json(updatedAvatar);
    });
  } catch (error) {
    return next(new HttpError(error));
  }
};





// ==== EDIT USER DETAILS FROM PROFILE
// POST : api/users/edit-user
// PROTECTED

const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError('Fill in all fields.', 422));
    }

    // Retrieve user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError('User not found.', 403));
    }

    // Check if new email already exists (await added here)
    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id.toString() !== req.user.id) {
      return next(new HttpError('Email already exists.', 422));
    }

    // Validate current password
    const validateUserPassword = await brcypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return next(new HttpError('Invalid current password.', 422));
    }

    // Confirm new passwords match
    if (newPassword !== confirmNewPassword) {
      return next(new HttpError('New passwords do not match.', 422));
    }

    // Hash the new password
    const salt = await brcypt.genSalt(10);
    const hash = await brcypt.hash(newPassword, salt);

    // Update user info in database
    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hash },
      { new: true }
    ).lean(); // Adding .lean() here to avoid circular structure issues

    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError('User update failed.', 500));
  }
};




// ==== GET AUTHORS
// POST : api/users/authors
// UNPROTECTED
const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select('-password')
    res.status(200).json(authors)
  } catch (error) {
    return next(new HttpError(error))
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  editUser,
  getAuthors,
  changeAvatar,
  UserModel,
};
