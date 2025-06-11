import { Cloudinary } from "@cloudinary/url-gen";

// Maak een nieuwe Cloudinary instance aan
const cld = new Cloudinary({
  cloud: {
    cloudName: "dz59lvb9i" // Controleer of dit je correcte cloud name is
  }
});

export default cld;