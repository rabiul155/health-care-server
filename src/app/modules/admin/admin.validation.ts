import { z } from "zod";

const adminValidationSchema = z.object({
  name: z.string({ required_error: "Name is required." }),
  contactNo: z.string({ required_error: "Contact no is required." }),
});

export default adminValidationSchema;
