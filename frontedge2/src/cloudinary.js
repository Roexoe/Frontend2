import { Cloudinary } from "@cloudinary/url-gen";

// Maak een nieuwe Cloudinary instance aan
const cld = new Cloudinary({
  cloud: {
    cloudName: "dz59lvb9i" // Vervang dit met je eigen cloud name
  }
});

export default cld;