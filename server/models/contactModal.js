import mongoose from "mongoose";

const contactModal = mongoose.Schema({
    contact_uid : {
        type:String,
        required:true,
        default : crypto.randomUUID(),
    },
    savedUser : {
        type:String,
        required:true,
    },
    contact_name : {
        type:String,
        required:true,
    }, 
    contact_role : {
        type : String,
        required:true,
    },
    contact_email:{
        type : String,
        required:true,
    },
    contact_phone : {
        type : Number,
        required:true,
    },
    contact_dob : {
        type : Date,
        required:true,
    },
    contact_relation:{
        type : String,
        required:true,
    },
    contact_address : {
        type : String,
        required:true,
    }

})

export default mongoose.model("contacts", contactModal)