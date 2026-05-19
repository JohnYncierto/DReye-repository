import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
console.log('AWS_REGION:', process.env.AWS_REGION || 'MISSING');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'loaded' : 'MISSING');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'loaded' : 'MISSING');
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME ? 'loaded' : 'MISSING');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'loaded' : 'MISSING');


import { uploadImageToStorage, getPresignedUrl } from './services/storageService.js';
import { saveResult, getResults } from './services/dbService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:5173'}));
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

app.post('/api/screen', upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'gradcam', maxCount: 1 }]), 
    async (req, res) => {
    try {
        const {
            patientName,
            patientID,
            doctorName,
            diagnosis,
            notes,
            confidence
        } = req.body;
        if (!patientName) {return res.status(400).json({ error: 'patientName is required' });}
        if (!diagnosis)  return res.status(400).json({ error: 'diagnosis is required' });
        if (!confidence)  return res.status(400).json({ error: 'confidence is required' });
        if (!req.files.image) {return res.status(400).json({ error: 'Retinal image file is required' });}
        if (!req.files.gradcam) {return res.status(400).json({ error: 'Grad-CAM image file is required' });}
        const screeningId = uuidv4();
        const imageFile   = req.files.image[0];
        const gradcamFile = req.files.gradcam[0]

        // 1. Upload image to storage
        const [imageKey, gradcamKey] = await Promise.all([
        uploadImageToStorage({
            screeningId,
            fileBuffer: imageFile.buffer,
            mimetype: imageFile.mimetype,
            originalName: imageFile.originalname,
            folder: 'retinal_images'
        }),
        uploadImageToStorage({
            screeningId,
            fileBuffer:   gradcamFile.buffer,
            mimetype:     gradcamFile.mimetype,
            originalName: gradcamFile.originalname,
            folder:       'gradcam-images',
        }),
        ]);
    
        // 2. Persist to DB
        const result = await saveResult({
            screeningId,
            patientName,
            patientID: patientID || null,
            doctorName: doctorName || null,
            diagnosis: diagnosis || null,
            notes: notes || null,
            imageUrl: imageKey,
            gradcamUrl: gradcamKey,
            confidence: parseFloat(confidence),
        });

        const [imagePresigned, gradCamPresigned] = await Promise.all([
            getPresignedUrl(imageKey),
            getPresignedUrl(gradcamKey)
        ]);

        res.status(201).json({
            success: true, 
            result: {
                ...result, 
                image_url: imagePresigned, 
                gradcam_url: gradCamPresigned
            }
        });
    } catch (err) {
        console.error('[POST /api/screen]', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }

});

// ─── GET /api/results ─────────────────────────────────────────────────────────
app.get('/api/results', async (req, res) => {
    try {
        const rows = await getResults(req.query.search || null);

        const results = await Promise.all(rows.map(async (row) => {
            const [imagePresigned, gradCamPresigned] = await Promise.all([
                getPresignedUrl(row.image_url),
                getPresignedUrl(row.gradcam_url)
            ]);
            return {...row, image_url: imagePresigned, gradcam_url: gradCamPresigned};
        }));

        res.json({ success: true, results });
    } catch (err) {
        console.error('[GET /api/results]', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

// ─── GET /api/results/:screeningID ─────────────────────────────────────────────────────────
app.get('/api/results/:screeningId', async (req, res) => {
    try {
        const results = await getResults({  });
        const result = results.find(r => r.screeningId === req.params.screeningId);
        if (!result) return res.status(404).json({ error: 'Result not found' });

        const [imagePresigned, gradCamPresigned] = await Promise.all([
            getPresignedUrl(result.image_url),
            getPresignedUrl(result.gradcam_url)
        ]);

        res.json({ result: { ...result, image_url: imagePresigned, gradcam_url: gradCamPresigned } });
    } catch (err) {
        console.error(`[GET /api/results/${req.params.screeningId}]`, err);
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