const ObjectId = require('mongoose').Types.ObjectId;

module.exports.defaultSchemaOptions = {
  toJSON: {
    versionKey: false,
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
};

module.exports.isValidObjectId = (id) => ObjectId.isValid(id) && id === new ObjectId(id).toString();
