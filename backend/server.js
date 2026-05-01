import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

import { uploadImageToStorage } from './services/storageService.js';
import { saveResult, getResults } from './services/dbService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:5713'}));
app.use(express.json());


// Multer: store file in memory
const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed!'), false);
    },
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── POST /api/screen ─────────────────────────────────────────────────────────

app.post('/api/screen', upload.single('file'), async (req, res) => {
    try {
        const { patientName, patientID, doctorName, diagnosis, notes } = req.body;
        if (!patientName) {return res.status(400).json({ error: 'patientName is required' });}
        if (!prediction)  return res.status(400).json({ error: 'prediction is required' });
        if (!confidence)  return res.status(400).json({ error: 'confidence is required' });
        if (!req.file) {return res.status(400).json({ error: 'Retinal image file is required' });}

        const screeningID = uuidv4();

        // 1. Upload image to storage
        const imageUrl = await uploadImageToStorage({
            screeningID,
            fileBuffer: req.file.buffer,
            mimetype: req.file.mimetype,
            originalName: req.file.originalname
        });
    
        // 2. Persist to DB
        const result = await saveResult({
            screeningID,
            patientName,
            patientID: patientID || null,
            doctorName: doctorName || null,
            diagnosis: diagnosis || null,
            notes: notes || null,
            imageUrl,
            prediction,
            confidence: parseFloat(confidence),
        });

        res.status(201).json({success: true, result});

    } catch (err) {
        console.error('[POST /api/screen]', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }

});

// ─── GET /api/results ─────────────────────────────────────────────────────────
app.get('/api/results', async (req, res) => {
    try {
        const results = await getResults({search: req.query.search || ''});
        res.json({ success: true, results });
    } catch (err) {
        console.error('[GET /api/results]', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

// ─── GET /api/results/:screeningID ─────────────────────────────────────────────────────────
app.get('/api/results/:screeningID', async (req, res) => {
    try {
        const results = await getResults({  });
        const result = results.find(r => r.screeningID === req.params.screeningID);
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.json({ result });
    } catch (err) {
        console.error(`[GET /api/results/${req.params.screeningID}]`, err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

// ─── Global Error Handling ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`DR Screening backend running on http://localhost:${port}`);
});