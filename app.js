if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const nodemailer = require("nodemailer");
const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");
const helmet = require("helmet");
const app = express();
const path = require("path");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Helmet
const scriptSrcUrls = [
  "https://unpkg.com/scrollreveal",
  "https://kit.fontawesome.com",
];

const styleSrcUrls = ["https://fonts.googleapis.com"];

const connectSrcUrls = ["https://ka-f.fontawesome.com"];
const fontSrcUrls = [
  "'self'",
  "https://kit.fontawesome.com",
  "https://fonts.gstatic.com",
  "https://ka-f.fontawesome.com",
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      scriptSrcElem: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      styleSrcElem: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      fontSrc: fontSrcUrls,
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dgwtmmyl7/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Custom Joi Extension
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// Contact Form Validation Schema
const contactFormSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  email: Joi.string().email().required().escapeHTML(),
  message: Joi.string().required().escapeHTML(),
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "portfolio.html"));
});

app.post("/send", (req, res) => {
  const { name, email, message, website } = req.body;

  if (website) {
    console.log("Possible spam submission:", req.body);
    res
      .status(400)
      .json({ success: false, message: "Possible spam submission" });
    return;
  }

  const { error, value } = contactFormSchema.validate({ name, email, message });
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }

  const {
    name: validatedName,
    email: validatedEmail,
    message: validatedMessage,
  } = value;

  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: validatedEmail,
    to: process.env.NODEMAILER_USER,
    subject: "New contact form submission",
    text: `
      Name: ${validatedName}
      Email: ${validatedEmail}
      Message: ${validatedMessage}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error sending email" });
    } else {
      console.log("Email sent:", info.response);

      res.json({ success: true, message: "Email sent successfully" });
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
