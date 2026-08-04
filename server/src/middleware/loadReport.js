import mongoose from 'mongoose';
import { Report } from '../models/Report.js';
import { ApiError } from '../utils/ApiError.js';

/** Resolve :reportId into req.report once, so handlers and the pipeline gate
 *  can both rely on it without re-querying. */
export async function loadReport(req, _res, next) {
  const { reportId } = req.params;
  if (!mongoose.isValidObjectId(reportId)) {
    return next(ApiError.badRequest(`"${reportId}" is not a valid report id`));
  }
  const report = await Report.findById(reportId).populate('client');
  if (!report) return next(ApiError.notFound('Report'));
  req.report = report;
  return next();
}
