export const create = async ({model, data, options = {}} = {}) => {
  let [doc] = await model.create([data], options);
  return doc;
};
export const findOne = async ({
  model,
  select = "",
  filter = {},
  options = {},
} = {}) => {
  let doc = model.findOne(filter).select(select);
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.skip) {
    doc.skip(options.skip);
  }
  if (options?.limit) {
    doc.limit(options.limit);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
};

export const find = async ({
  model,
  select = "",
  filter = {},
  options = {},
} = {}) => {
  let doc = model
    .find(filter, null, {
      session: options?.session,
    })
    .select(select);

  if (options?.populate) doc.populate(options.populate);

  if (options?.skip) doc.skip(options.skip);

  if (options?.limit) doc.limit(options.limit);

  if (options?.lean) doc.lean();

  return await doc.exec();
};

export const findById = async ({model, id, options = {}, select = ""} = {}) => {
  let doc = model
    .findById(id, null, {
      session: options?.session,
    })
    .select(select);

  if (options?.populate) doc.populate(options.populate);

  if (options?.lean) doc.lean();

  return await doc.exec();
};

export const updateOne = async ({
  model,
  filter = {},
  update = {},
  options = {},
} = {}) => {
  let doc = model.updateOne(filter, update, {
    runValidators: true,
    session: options?.session,
    ...options,
  });

  return await doc.exec();
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  update = {},
  select = "",
  options = {},
} = {}) => {
  let doc = model
    .findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
      session: options?.session,
      ...options,
    })
    .select(select);

  return await doc.exec();
};

export const deleteOne = async ({filter, model, options = {}}) => {
  return await model.deleteOne(filter || {}, {
    session: options?.session,
  });
};
export const deleteMany = async ({filter, model, options = {}}) => {
  return await model.deleteMany(filter || {}, {
    session: options?.session,
  });
};

export const countDocuments = async ({model, filter, options = {}}) => {
  return await model.countDocuments(filter, {
    session: options?.session,
  });
};
