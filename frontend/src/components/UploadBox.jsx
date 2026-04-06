import {useState} from 'react';

export default function UploadBox() {
     const [form, setForm] = useState({
        patientName: '',
        patientID: '',
        doctorName: '',
        diagnosis: '',
        notes: '',
        file: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ 
            ...form,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = (e) => {
        console.log("Submitted data:", form);
        //later AWS
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
                    value={form.category}
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
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Submit
                </button>

            </div>

        </div>
    );
}