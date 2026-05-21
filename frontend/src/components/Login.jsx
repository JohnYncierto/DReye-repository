import {useState} from 'react';

const PASSCODE = 'DReye2024!';

export default function Login({onLogin}) {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    const handleSubmit = () =>{
        if(input === PASSCODE){
            onLogin();
        } else{
            setError('Incorrect passcode');
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    const handleKey = (e) => {
        if(e.key === 'Enter') handleSubmit();
    };

    return (
        <div className = "min-h-screen flex items-center justify-center bg-blue-950">
            <div className={`bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center gap-6 ${shake ? 'animate-shake' : ''}`}
            style={{ animation: shake ? 'shake 0.5s' : 'none' }}
            >
                {/* Title */}
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-blue-800 text-white text-3xl font-bold px-5 py-3 rounded-xl tracking-widest">
                        DREye
                    </div>
                    <p className = "text-gray-400 text-sm mt-2">DR Screening System</p>
                </div>

                {/* Passcode Input */}
                <div className="w-full flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">Passcode</label>
                    <input
                        type="password"
                        placeholder="Enter Passcode"
                        value={input}
                        onChange={(e) => {setInput(e.target.value); setError('');}}
                        onKeyDown={handleKey}
                        className="border border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-800 text-white py-2 px-6 rounded-lg text-sm font-semibold hover:bg-blue-900 transition"
                >
                    Enter
                </button>
            </div>
            <style>{`
                @keyframes shake {
                    0% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-6px); }
                    80% { transform: translateX(6px); }
                }
            `}
            </style>

        </div>

    );
}