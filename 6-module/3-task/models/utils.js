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
