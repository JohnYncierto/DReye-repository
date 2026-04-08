export default function Results({ results }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
            {results.image &&(
                <img 
                    src={results.image}
                    alt="retina"
                    className="w-full h-40 object-cover"
                />
            )}

            <div className="p-4">
                <h3 className="font-semibold text-lg">{results.patientName}</h3>

                <p className="text-gray-500">Doctor: {results.doctorName || "NA"}</p>
                <p className="text-gray-500">Category: {results.category || "NA"}</p>

                <p className="mt-2 font-medium">{results.prediction}</p>

                <p className="text-gray-400 mt-2">Confidence: {(results.confidence * 100).toFixed(2)}%</p>
                
                {results.notes && (
                    <p className="text-gray-500 mt-2">Notes: {results.notes}</p>
                )}
            </div>
            
            
        </div>
    );
}
