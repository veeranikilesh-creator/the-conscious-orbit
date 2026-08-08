import { Report } from '../models/Report.js';
import { ModuleResult } from '../models/ModuleResult.js';
import { sendReportEmail } from '../integrations/email.js';

export async function submitReview(req, res) {
  try {
    const { reportId } = req.params;
    const { adminScore, adminAnalysis, adminVerdict, adminStrengths, adminRisks, approvalNote } = req.body;

    if (adminScore === undefined || adminScore === null) {
      return res.status(422).json({
        error: 'Validation failed',
        message: 'adminScore is required',
        issues: [{ path: 'adminScore', message: 'Required', code: 'required' }],
      });
    }
    if (typeof adminScore !== 'number' || adminScore < 0 || adminScore > 100) {
      return res.status(422).json({
        error: 'Validation failed',
        message: 'adminScore must be between 0 and 100',
        issues: [{ path: 'adminScore', message: 'Must be 0-100', code: 'invalid' }],
      });
    }

    const report = await Report.findById(reportId).populate('client');
    if (!report) return res.status(404).json({ error: 'Report not found', message: `No report with id ${reportId}` });
    if (report.status !== 'REVIEWING') {
      return res.status(409).json({
        error: 'Report not in REVIEWING status',
        message: `Report is currently ${report.status}. Can only review reports in REVIEWING status.`,
      });
    }

    report.adminScore = adminScore;
    report.adminAnalysis = adminAnalysis || null;
    report.adminVerdict = adminVerdict || null;
    report.adminStrengths = adminStrengths || null;
    report.adminRisks = adminRisks || null;
    report.approvalNote = approvalNote || null;
    report.reviewedBy = 'admin';
    report.reviewedAt = new Date();
    report.score = adminScore;

    /* The client portal renders GO/PIVOT from `decision`, so the admin's
       verdict has to be recorded there too — otherwise an approved report
       shows as "CONDITIONAL" regardless of what the reviewer decided. An
       explicit verdict wins; without one, fall back to the 60-point
       threshold the scoring engine uses. */
    const verdict = String(adminVerdict || '').trim().toUpperCase();
    if (['GO', 'PROCEED'].includes(verdict)) report.decision = 1;
    else if (['PIVOT', 'NO', 'NO-GO', 'NO GO'].includes(verdict)) report.decision = 0;
    else report.decision = adminScore >= 60 ? 1 : 0;

    report.recordTransition('PUBLISHED', 'Admin approved report');
    await report.save();

    const emailResult = await sendReportEmail(report.toJSON(), report.client);

    return res.json({
      report: report.toJSON(),
      email: emailResult,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Review submission failed', message: error.message });
  }
}
