import {useState} from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UploadBox() {
     const [form, setForm] = useState({
        patientName: '',
        patientID: '',
        doctorName: '',
        diagnosis: '',
        notes: '',
        prediction: '',
        confidence: '',
        file: null,
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

    const handleSubmit = (e) => {
        setError('');

        if (!form.patientName.trim()) return setError('Patient Name is required');
        if (!form.prediction.trim()) return setError('Prediction is required');
        if (!form.confidence.trim()) return setError('Confidence is required');
        if (!form.file) return setError('Retinal image file is required');
        
        const conf = parseFloat(form.confidence);
        if (isNaN(conf) || conf < 0 || conf > 1) {
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
            formData.append('prediction', form.prediction);
            formData.append('confidence', form.confidence);
            formData.append('file', form.file);

            const res = await fetch(`${API_URL}/api/screen`, {
                method: 'POST',
                body: formData,
            });

            if(!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to submit form');
            }

            const {result} = await res.json();

            onsubmit({
                ...result,
                // Local preview URL since mock S3 isn't publicly accessible yet
                file: form.file, 
            });

            setForm({
                patientName: '',
                patientID: '',
                doctorName: '',
                diagnosis: '',
                notes: '',
                prediction: '',
                confidence: '',
                file: null,
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

                {/*File Upload */}
                <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                />

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
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    {loading ? 'Saving' : 'Save Result'}
                </button>

            </div>

        </div>
    );
}