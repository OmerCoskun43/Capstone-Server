"use strict";

module.exports = (req, res, next) => {
  // ### FILTERING ###

  const filter = req.query?.filter || {};
  // ### SEARCHING ###

  const search = req.query?.search || {};
  for (let key in search) search[key] = { $regex: search[key], $options: "i" }; // i: case insensitive
  // ### SORTING ###
  const sort = req.query?.sort || {};
  // ### PAGINATION ###
  let limit = Number(req.query?.limit);

  limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 20);

  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0; // Backend'de sayfa sayısı her zaman (page - 1)'dir.

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;

  /* FILTERING & SEARCHING & SORTING & PAGINATION */
  res.getModelList = async (Model, customFilter = {}, populate = null) => {
    return await Model.find({ ...filter, ...search, ...customFilter })
      .sort(sort)
      .sort({ $natural: -1 })
      .skip(skip)
      .limit(limit)
      .populate(populate);
  };

  // Details:
  res.getModelListDetails = async (Model, customFilter = {}) => {
    const data = await Model.find({ ...filter, ...search, ...customFilter });

    let details = {
      filter,
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 0 ? page : false,
        current: page + 1,
        next: page + 2,
        total: Math.ceil(data.length / limit),
      },
      totalRecords: data.length,
    };
    details.pages.next =
      details.pages.next > details.pages.total ? false : details.pages.next;
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };

  next();
};
