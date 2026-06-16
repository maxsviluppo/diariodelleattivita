import React, { useState } from "react";
import { auth } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, Activity, Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";
import firebaseConfig from "../../firebase-applet-config.json";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<React.ReactNode | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Basic Validation
    if (isRegister && !name.trim()) {
      setErrorMsg("Per favore, inserisci il tuo nome.");
      setIsLoading(false);
      return;
    }
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Per favore, compila tutti i campi.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg("La password deve contenere almeno 6 caratteri.");
      setIsLoading(false);
      return;
    }

    const projectId = firebaseConfig.projectId || "gen-lang-client-0071430994";
    const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;

    const getOperationNotAllowedUI = () => (
      <div className="flex flex-col gap-2">
        <p className="font-bold text-rose-800 animate-pulse">
          Il metodo di accesso "Email/Password" non è ancora abilitato su Firebase per questo progetto.
        </p>
        <p className="font-normal text-gray-700 text-[10px] leading-relaxed">
          Per sbloccarlo ed abilitare la registrazione degli account personalizzati:
        </p>
        <ol className="list-decimal pl-4 text-left text-[10px] text-gray-700 font-semibold space-y-1">
          <li>
            Apri la console Firebase cliccando sul pulsante qui sotto:
          </li>
          <li>
            Sotto la scheda <span className="text-pink-600 font-bold">Sign-in method</span>, clicca su <span className="font-bold">Aggiungi nuovo provider</span>.
          </li>
          <li>
            Seleziona <span className="font-bold">E-mail/password</span>, abilita l'interruttore e clicca su <span className="font-bold">Salva</span>.
          </li>
        </ol>
        <a 
          href={consoleUrl} 
          target="_blank" 
          referrerPolicy="no-referrer"
          className="mt-2 w-full inline-flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-3 rounded-lg text-[10px] shadow-sm uppercase transition-all"
        >
          Abilita Email/Password sulla Console ↗
        </a>
      </div>
    );

    try {
      if (isRegister) {
        // Explicit Register flow
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, {
          displayName: name.trim()
        });
        
        setErrorMsg(
          <div className="text-emerald-700 font-black text-xs text-center py-1 flex items-center justify-center gap-1.5 min-h-[30px]" id="auth-register-success-indicator">
            <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            Registrazione completata! Accesso automatico al Diario...
          </div>
        );
        setTimeout(() => {
          onLoginSuccess();
        }, 1200);
      } else {
        // Intelligent Login flow with automatic fallback
        try {
          await signInWithEmailAndPassword(auth, email.trim(), password);
          setErrorMsg(
            <div className="text-emerald-700 font-black text-xs text-center py-1 flex items-center justify-center gap-1.5 min-h-[30px]" id="auth-login-success-indicator">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              Accesso riuscito! Caricamento in corso...
            </div>
          );
          setTimeout(() => {
            onLoginSuccess();
          }, 800);
        } catch (err: any) {
          console.warn("Attempt login failed, checking auto-registration fallback:", err.code || err.message);
          
          if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
            // "se utente non registrato passa automaticamente alla registrazione"
            const suggestedName = email.split("@")[0];
            setName(suggestedName);
            setIsRegister(true);
            
            setErrorMsg(
              <div className="text-pink-800 text-[11px] font-bold text-center py-1">
                Utente non registrato. Attivazione registrazione automatica...
              </div>
            );

            // Trigger registration under the hood
            setTimeout(async () => {
              try {
                const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
                await updateProfile(userCredential.user, {
                  displayName: suggestedName
                });
                
                setErrorMsg(
                  <div className="text-emerald-700 font-black text-xs text-center py-1 flex items-center justify-center gap-1.5 min-h-[30px]" id="auth-auto-success-indicator">
                    <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    Registrazione completata! Caricamento delle attività in corso...
                  </div>
                );
                setTimeout(() => {
                  onLoginSuccess();
                }, 1200);
              } catch (regErr: any) {
                console.warn("Auto-register fallback exception:", regErr.code || regErr.message, regErr);
                if (regErr.code === "auth/email-already-in-use") {
                  // The email exists, so they typed the wrong password instead of wanting registration
                  setIsRegister(false);
                  setErrorMsg("La password inserita non è corretta per questo account esistente.");
                } else if (regErr.code === "auth/operation-not-allowed") {
                  setErrorMsg(getOperationNotAllowedUI());
                } else {
                  setErrorMsg("Errore durante la registrazione automatica: " + (regErr.message || "Riprova."));
                }
              }
            }, 1000);
          } else if (err.code === "auth/operation-not-allowed") {
            setErrorMsg(getOperationNotAllowedUI());
          } else if (err.code === "auth/invalid-email") {
            setErrorMsg("L'indirizzo email inserito non è valido.");
          } else {
            setErrorMsg("Errore durante l'accesso: " + (err.message || "Riprova."));
          }
        }
      }
    } catch (err: any) {
      console.warn("Auth helper warning:", err.code || err.message, err);
      if (err.code === "auth/email-already-in-use") {
        setIsRegister(false);
        setErrorMsg("Questo indirizzo email è già registrato. Se hai già un account, inserisci la password corretta per accedere.");
      } else if (err.code === "auth/operation-not-allowed") {
        setErrorMsg(getOperationNotAllowedUI());
      } else if (err.code === "auth/invalid-email") {
        setErrorMsg("L'indirizzo email inserito non è valido.");
      } else if (err.message && err.message.includes("apiKey")) {
        setErrorMsg("Configurazione Firebase non ancora attiva nel cloud. Si prega di ricaricare la pagina o effettuare l'accesso più tardi.");
      } else {
        setErrorMsg("Si è verificato un errore durante la registrazione: " + (err.message || "Riprova."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[radial-gradient(circle_at_center,_#fffdfd_0%,_#ffeef1_40%,_#ffd3da_100%)] text-gray-800 flex flex-col justify-center items-center px-4 py-12 selection:bg-pink-200 selection:text-pink-900 overflow-y-auto">
      {/* Container Card with Apple App Store Squircle Glass Design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/50 p-8 sm:p-10 shadow-xl shadow-pink-100/30 flex flex-col gap-6 relative overflow-hidden"
        id="login-card-container"
      >
        {/* Decorative iOS Grid Highlight Style */}
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

        {/* Head Branding */}
        <div className="flex flex-col items-center text-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-200"
          >
            <Activity className="w-7 h-7 stroke-[2]" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-700 to-rose-600 bg-clip-text text-transparent">
              Diario delle Attività
            </h1>
            <p className="text-xs font-bold text-pink-500/80 tracking-wide uppercase mt-0.5">
              Il tuo spazio personale tracciato
            </p>
          </div>
        </div>

        {/* Segmented Control iOS-style Switcher */}
        <div className="bg-pink-100/40 p-1 rounded-xl flex border border-pink-200/50" id="login-nav-tabs">
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              !isRegister
                ? "bg-white text-pink-700 shadow-md"
                : "text-pink-600/75 hover:text-pink-700 hover:bg-white/30"
            }`}
            onClick={() => {
              setIsRegister(false);
              setErrorMsg(null);
            }}
            id="tab-accedi-btn"
          >
            Accedi
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isRegister
                ? "bg-white text-pink-700 shadow-md"
                : "text-pink-600/75 hover:text-pink-700 hover:bg-white/30"
            }`}
            onClick={() => {
              setIsRegister(true);
              setErrorMsg(null);
            }}
            id="tab-registrati-btn"
          >
            Registrati
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5"
                key="name-input-group"
              >
                <label className="text-xs font-black text-pink-700 uppercase tracking-wide px-1">Nome completo</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-pink-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mario Rossi"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/60 focus:bg-white border border-pink-100/70 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-300/10 text-xs font-bold text-gray-800 transition-all placeholder:text-gray-400 placeholder:font-normal"
                    id="login-name-input"
                  />
                </div>
              </motion.div>
            )}

            <div className="flex flex-col gap-1.5" key="email-input-group">
              <label className="text-xs font-black text-pink-700 uppercase tracking-wide px-1">Indirizzo Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-pink-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mario@esempio.it"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/60 focus:bg-white border border-pink-100/70 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-300/10 text-xs font-bold text-gray-800 transition-all placeholder:text-gray-400 placeholder:font-normal"
                  id="login-email-input"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5" key="password-input-group">
              <label className="text-xs font-black text-pink-700 uppercase tracking-wide px-1">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-pink-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="------"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/60 focus:bg-white border border-pink-100/70 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-300/10 text-xs font-bold text-gray-800 transition-all placeholder:text-gray-400"
                  id="login-password-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-pink-400 hover:text-pink-600 transition-colors cursor-pointer"
                  id="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </AnimatePresence>

          {/* Inline Error Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-[11px] font-bold text-rose-700 leading-relaxed shadow-3xs"
                id="login-error-container"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-2 rounded-xl bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-pink-200/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-pink-700/20"
            id="login-submit-btn"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? "Registrati" : "Accedi"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="flex flex-col items-center gap-2 border-t border-pink-100/60 pt-5 text-center">
          <p className="text-xs text-gray-500 font-medium">
            {isRegister ? "Hai già un account?" : "Non hai ancora un account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg(null);
            }}
            className="text-xs font-black text-pink-600 hover:text-pink-700 hover:underline transition-all cursor-pointer"
            id="login-toggle-mode-btn"
          >
            {isRegister ? "Accedi al tuo account" : "Registrati e crea un account"}
          </button>
        </div>

        {/* Sparkles decorative icon */}
        <div className="absolute right-4 bottom-4 text-pink-200 pointer-events-none">
          <Sparkles className="w-5 h-5 animate-pulse-slow" />
        </div>
      </motion.div>

      {/* Footer info explaining need to authorize Email/Password inside Firebase Consolw */}
      <div className="mt-8 max-w-sm text-center">
        <p className="text-[10px] text-pink-700/60 leading-relaxed font-semibold">
          *Se riscontri errori di accesso o la configurazione è vuota, assicurati di aver abilitato l'accesso via "Email/Password" nella sezione Authentication del tuo pannello Firebase Console.
        </p>
      </div>
    </div>
  );
}
