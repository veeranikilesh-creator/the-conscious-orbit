import { Report } from '../models/Report.js';
import { ModuleResult } from '../models/ModuleResult.js';
import { generateOrbitaAnalysis } from '../integrations/orbita.js';

export async function runOrbitaAnalysis(req, res) {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ error: 'Report not found', message: `No report with id ${reportId}` });

    const moduleResults = await ModuleResult.find({ report: reportId });
    if (!moduleResults.length) {
      return res.status(409).json({
        error: 'No modules completed',
        message: 'Run at least one module before requesting Orbita analysis.',
      });
    }

    const analysis = await generateOrbitaAnalysis(report, moduleResults);
    report.orbitaAnalysis = analysis;
    await report.save();

    return res.json({ analysis });
  } catch (error) {
    return res.status(500).json({ error: 'Orbita analysis failed', message: error.message });
  }
}
