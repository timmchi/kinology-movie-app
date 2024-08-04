const v = require("valibot");

// comments
const CommentSchema = v.object({
  content: v.optional(
    v.pipe(
      v.string("Comment must be a string"),
      v.minLength(1, "Comments can not be empty")
    )
  ),
  author: v.optional(
    v.string(v.hexadecimal("The authorId hexadecimal is badly formatted."))
  ),
  receiver: v.optional(
    v.string(v.hexadecimal("The receiverId hexadecimal is badly formatted."))
  ),
  movieReceiver: v.optional(
    v.string(v.number("The movieId is badly formatted."))
  ),
});

const paramsIdSchema = v.object({
  commentId: v.optional(
    v.string(v.hexadecimal("The commentId hexadecimal is badly formatted"))
  ),
  movieId: v.optional(v.string(v.minValue("2"))),
});

const MovieSchema = v.object({
  title: v.optional(v.string()),
  poster: v.optional(v.pipe(v.string(), v.includes("/"), v.endsWith(".jpg"))),
});

// contact
const MessageSchema = v.object({
  email: v.pipe(
    v.string(),
    v.minLength(1, "Please enter your email."),
    v.email("The email address is badly formatted")
  ),
  name: v.pipe(
    v.string(),
    v.minLength(1, "Please enter your name or nickname."),
    v.minLength(3, "Name or nickname should be 3 or more symbols")
  ),
  message: v.pipe(
    v.string(),
    v.minLength(1, "Please enter your message"),
    v.minLength(3, "Message should be 3 or more symbols")
  ),
});

// login
const LoginSchema = v.object({
  username: v.pipe(
    v.string("Username must be a string."),
    v.minLength(1, "Please enter your username."),
    v.minLength(3, "Username needs to be at least 3 characters long.")
  ),
  password: v.pipe(
    v.string("Your password must be a string."),
    v.minLength(1, "Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more."),
    v.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "Your password must have one uppercase letter, one lowercase letter and one number"
    )
  ),
});

// movies
const searchQuerySchema = v.object({
  genres: v.array(v.string("Genre should be a string")),
  year: v.union([
    v.pipe(
      v.string(),
      v.minValue("1874", "Movies can not be shot before 1874"),
      v.maxValue(
        `${new Date().getFullYear()}`,
        "Can not search for movies shot after current year"
      )
    ),
    v.literal(""),
  ]),
  ratingUpper: v.pipe(
    v.number("Rating should be a number"),
    v.minValue(0, "Rating can not be lower than 0"),
    v.maxValue(10, "Rating can not be higher than 10")
  ),
  ratingLower: v.pipe(
    v.number("Rating should be a number"),
    v.minValue(0, "Rating can not be lower than 0"),
    v.maxValue(10, "Rating can not be higher than 10")
  ),
  country: v.pipe(
    v.string("Country should be a string"),
    v.maxLength(100, "Country name can not be this long")
  ),
  page: v.pipe(
    v.number("Page should be a number"),
    v.maxValue(10, "Can not search for movies past page 10")
  ),
  director: v.string("Director should be a string"),
  actors: v.array(v.string("Actor should be a string")),
});

const searchByTitleSchema = v.object({
  title: v.pipe(v.string()),
});

// users
const RegistrationSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string(),
      v.minLength(1, "Please enter your email."),
      v.email("The email address is badly formatted")
    ),
    username: v.pipe(
      v.string(),
      v.minLength(1, "Please enter your username."),
      v.minLength(3, "Username should be 3 or more symbols")
    ),
    name: v.pipe(
      v.string(),
      v.minLength(1, "Please enter your name or nickname."),
      v.minLength(3, "Name or nickname should be 3 or more symbols")
    ),
    password: v.pipe(
      v.string(),
      v.minLength(1, "Please enter your password."),
      v.minLength(8, "Your password must have 8 characters or more."),
      v.regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Your password must have one uppercase letter, one lowercase letter and one number"
      )
    ),
    passwordConfirm: v.pipe(
      v.string(),
      v.minLength(1, "Please confirm password")
    ),
  }),
  v.forward(
    v.check(
      (input) => input.password === input.passwordConfirm,
      "The two password do not match"
    ),
    ["passwordConfirm"]
  )
);

const MovieActionSchema = v.object({
  id: v.union([
    v.pipe(v.string(), v.minValue(2)),
    v.pipe(v.number(), v.minValue(2)),
  ]),
  title: v.optional(v.string()),
  poster: v.optional(v.pipe(v.string(), v.includes("/"), v.endsWith(".jpg"))),
  button: v.picklist(["watched", "favorite", "later"]),
});

const UserUpdateSchema = v.object({
  biography: v.pipe(
    v.string("About me should be a string"),
    v.minLength(1, "Please enter something about yourself.")
  ),
  name: v.pipe(
    v.string("Name should be a string"),
    v.minLength(1, "Please enter your name"),
    v.minLength(3, "Name should be 3 or more symbols long")
  ),
});

const IdSchema = v.optional(
  v.string(v.hexadecimal("The receiverId hexadecimal is badly formatted."))
);

const AvatarSchema = v.object({
  fieldname: v.string("Field name is required"),
  originalname: v.string("Original name is required"),
  encoding: v.string("Encoding is required"),
  mimetype: v.picklist(["image/jpeg", "image/png", "image/jpg", "image/svg"]),
  size: v.pipe(
    v.number(),
    v.maxValue(1024 * 1024 * 2, "The size must not exceed 2 MB")
  ),
  // eslint-disable-next-line no-undef
  buffer: v.instance(Buffer),
});

module.exports = {
  CommentSchema,
  paramsIdSchema,
  MovieSchema,
  MessageSchema,
  LoginSchema,
  searchQuerySchema,
  searchByTitleSchema,
  RegistrationSchema,
  MovieActionSchema,
  UserUpdateSchema,
  IdSchema,
  AvatarSchema,
};
