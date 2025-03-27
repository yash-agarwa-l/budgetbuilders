/**
 * Builds a middleware that replaces req.body/query/params with the parsed and
 * typed result, so controllers never re-check shapes by hand. Zod failures are
 * turned into a 400 by the central error handler.
 */
export function validate(schemas) {
  return (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      if (schemas.query) {
        // req.query is a getter on Express 5, so assign onto validatedQuery.
        req.validatedQuery = schemas.query.parse(req.query);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
