export default function Results({ results }) {
    const date = results.created_at
        ? new Date(results.created_at).toLocaleString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : 'N/A';

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            {/* Images */}
            <div className="grid grid-cols-2">  
                <div className ="flex flex-col">
                    <span className="text-sxs text-center text-gray-400 py-1 bg-gray-50">Retinal Image</span>
                    {(results.imagePreview || results.image_url) && (
                        <img 
                            src={results.imagePreview || results.image_url}
                            alt="Retinal"
                            className="object-cover h-48 w-full"    
                        />
                    )}
                </div>
                <div className ="flex flex-col">
                    <span className="text-sxs text-center text-gray-400 py-1 bg-gray-50">Grad-CAM</span>
                    {(results.gradcamPreview || results.gradcam_url) && (
                        <img
                            src={results.gradcamPreview || results.gradcam_url}
                            alt="Grad-CAM"
                            className="object-cover h-48 w-full"
                        />
                    )}
                </div>
            </div>
            
            {/* Info */}
            <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold">{results.patient_name || results.patientName}</h3>
                <p className="text-sm text-gray-400">Patient ID: {results.patient_id || results.patientID || 'N/A'}</p>
                <p className="text-sm text-gray-500">Doctor: {results.doctor_name || results.doctorName || 'N/A'}</p>
                <p className="text-sm text-gray-500">
                    Diagnosis: <span className="font-medium text-gray-700">{results.diagnosis || 'N/A'}</span>
                </p>
                <p className="text-sm text-gray-500">
                    Confidence: {results.confidence}%
                </p>
                {(results.notes) && (
                    <p className="text-sm text-gray-400">Notes: {results.notes}</p>
                )}
                <p className="text-sm text-gray-400">Date: {date}</p>
            </div>

        </div>
    );
}
