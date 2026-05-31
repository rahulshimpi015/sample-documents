import { useState } from "react";
import { validatePhone, isPhoneEnabled } from "./validatePhone";

const PhoneValidation: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const showError = !!error && !focused;

  const handleBlur = () => {
    setFocused(false);
    setError(validatePhone(phone));
  };

  const handleSubmit = () => {
    const err = validatePhone(phone);
    setError(err);
    if (!err) alert("Submitted: " + phone);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-2xl font-semibold text-white mb-1">Phone Number</h1>
        <p className="text-slate-400 text-sm mb-6">Enter your mobile number to continue</p>

        <label className="block text-sm font-medium text-slate-300 mb-2">Mobile Number</label>

        <div className={`flex items-center rounded-xl border bg-slate-800/60 transition-all duration-200
          ${showError ? "border-red-500/70 ring-1 ring-red-500/30"
            : focused  ? "border-indigo-500/70 ring-1 ring-indigo-500/30"
            : "border-slate-600/60"}`}
        >
          <span className="pl-4 pr-3 py-3 text-slate-400 text-sm border-r border-slate-600/60">+</span>
          <input
            type="tel"
            value={phone}
            placeholder="1 800 000 0000"
            maxLength={16}
            onChange={(e) => { setPhone(e.target.value); setError(""); }}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            className="flex-1 bg-transparent px-3 py-3 text-white placeholder-slate-500 text-sm outline-none"
          />
        </div>

        {showError && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}

        {!showError && (
          <p className="text-slate-500 text-xs mt-2">Digits only · min 3, max 13</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isPhoneEnabled(phone)}
          className={`w-full mt-6 py-3 rounded-xl text-sm font-medium transition-all duration-150
            ${isPhoneEnabled(phone)
              ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg shadow-indigo-900/40"
              : "bg-slate-700 text-slate-400 cursor-not-allowed opacity-60"}`}
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default PhoneValidation;
