import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const companyServiceSchema = new Schema(
  {
    Title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name must be at most 120 characters']
    },
    Description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
      minlength: [50, 'Name must be at least 2 characters'],
      maxlength: [500, 'Name must be at most 120 characters']
    }
   

}
);



const companyService = mongoose.model('companyService', companyServiceSchema);
export default companyService;
