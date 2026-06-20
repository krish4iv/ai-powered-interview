const pdfParse = require('pdf-parse')
const {generateInterviewReport }= require('../services/ai.service')
const { InterviewReportModel } = require('../models/interviewreport.model')

async function createInterviewReport(req, res) {
    try {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const { selfDescription, jobDescription } = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error('createInterviewReport failed:', err);
        res.status(500).json({ message: "Failed to generate interview report.", error: err.message });
    }
}

module.exports= {createInterviewReport}