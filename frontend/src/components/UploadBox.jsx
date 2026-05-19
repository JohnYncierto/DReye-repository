import {useState} from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UploadBox({onSubmit}) {
     const [form, setForm] = useState({
        patientName: '',
        patientID: '',
        doctorName: '',
        diagnosis: '',
        notes: '',
        confidence: '',
        image: null,
        gradcam: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ 
            ...form,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        setError('');

        if (!form.patientName.trim()) return setError('Patient Name is required');
        if (!form.diagnosis.trim()) return setError('Diagnosis is required');
        if (!form.confidence.trim()) return setError('Confidence is required');
        if (!form.image) return setError('Retinal image file is required');
        if (!form.gradcam) return setError('Grad-CAM image file is required');

        const conf = parseFloat(form.confidence);
        if (isNaN(conf) || conf < 0 || conf > 100) {
            return setError('Confidence must be a number between 0 and 1');
        }
        
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('patientName', form.patientName);
            formData.append('patientID', form.patientID);
            formData.append('doctorName', form.doctorName);
            formData.append('diagnosis', form.diagnosis);
            formData.append('notes', form.notes);
            formData.append('confidence', form.confidence);
            formData.append('image', form.image);
            formData.append('gradcam', form.gradcam);

            const res = await fetch(`${API_URL}/api/screen`, {
                method: 'POST',
                body: formData,
            });

            if(!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to submit form');
            }

            const {result} = await res.json();
            console.log('result from API:', result);  // add this
            onSubmit({
                ...result,
                imagePreview: URL.createObjectURL(form.image),
                gradcamPreview: URL.createObjectURL(form.gradcam),
            });

            setForm({
                patientName: '',
                patientID: '',
                doctorName: '',
                diagnosis: '',
                notes: '',
                confidence: '',
                image: null,
                gradcam: null,
            });
        } catch (err) {
            setError('Error occurred while submitting the form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">
                Upload Retinal Image & Patient Info
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Patient Name */}
                <input
                    type="text"
                    name="patientName"
                    placeholder="Patient Name"
                    value={form.patientName}
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                />

                <input
                    type="text"
                    name="patientID"
                    placeholder="Patient ID"
                    value={form.patientID}
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                />

                {/* Doctor Name */}
                <input
                    type="text"
                    name="doctorName"
                    placeholder="Doctor Name"
                    value={form.doctorName}
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                />

                {/* Category */}
                <select
                    name="diagnosis"
                    value={form.diagnosis}
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                >
                    <option value="">Select Diagnosis</option>
                    <option value="No DR">No DR</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Proliferative DR">Proliferative DR</option>
                </select>

                {/* Confidence */}
                <input
                    type="number"
                    name="confidence"
                    placeholder="Confidence (0-100%)"
                    value={form.confidence}
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                    min="0"
                    max="100"
                    step="0.01"
                />

                {/*Retinal image Upload */}
                <div>
                    <label className="text-sm text-gray-500">Retinal Image: </label>
                    <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                />
                </div>

                {/* Grad-CAM image Upload */}
                <div>
                    <label className="text-sm text-gray-500">Grad-CAM Image: </label>
                    <input
                    type="file"
                    name="gradcam"
                    accept="image/*"
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                />
                </div>
                

                {/* Notes */}
                <textarea
                    name="notes"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="border p-2 rounded-lg w-full mt-4"
                    rows="3"
                />

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    {loading ? 'Saving' : 'Save Result'}
                </button>

            </div>

        </div>
    );
}