import React, { useState, useEffect, useRef } from "react";
import { Activity, ActivityLog } from "./types";
import { INITIAL_ACTIVITIES, PASTEL_COLORS } from "./data";
import ActivityGrid from "./components/ActivityGrid";
import ActivityLogList from "./components/ActivityLogList";
import ActivityForm from "./components/ActivityForm";
import ConfirmModal from "./components/ConfirmModal";
import LoginScreen from "./components/LoginScreen";
import { auth, db, handleFirestoreError, OperationType } from "./lib/firebase";
import { onAuthStateChanged, signOut, deleteUser, User } from "firebase/auth";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Activity as ActivityIcon, CheckCircle2, RefreshCw, Trophy, LogOut, Loader2, User as UserIcon, Cloud, CloudOff } from "lucide-react";
import IconRenderer from "./components/IconRenderer";

// Simple and beautiful organic browser-synthesized click chime audio pop
function playSuccessSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Low pass filter to keep it warm, sweet, and round
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(1000, now);
    
    // Fundamental chord component 1: E5
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // slides beautifully up to A5
    
    // Fundamental chord component 2: A5
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // slides up to D6 (perfect fifth chord chime!)
    
    // Decay curve envelope gain node
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.03); // super snappy onset click
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3); // smooth mellow decay
    
    // Connect up nodes
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(filterNode);
    filterNode.connect(ctx.destination);
    
    // Start and scheduling stopping parameters
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch (err) {
    console.warn("Web Audio chime play aborted by browser sandbox or gesture policies:", err);
  }
}

export default function App() {
  // Authentication & Session States
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);

  // Diary Data States
  const [activities, setActivities] = useState<Activity[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Scroll logo shrinking states
  const [shrinkLogo, setShrinkLogo] = useState(false);
  
  // Flash Feedback Modal States
  const [loggedActivityFeedback, setLoggedActivityFeedback] = useState<Activity | null>(null);
  const feedbackTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Shrink logo when scrolling down past 30px
      if (currentScrollY > 30) {
        setShrinkLogo(true);
      } else {
        setShrinkLogo(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Monitor firebase authentication status with protective timeout safety-net
  useEffect(() => {
    // 3.5 second fallback timer to unlock the screen in case Firebase Auth is stalled by environment sandboxing
    const timeoutTimer = setTimeout(() => {
      setAuthChecking((currentChecking) => {
        if (currentChecking) {
          console.warn("Firebase Auth load timed out. Displaying authenticating interface.");
          return false;
        }
        return currentChecking;
      });
    }, 3500);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
      
      if (currentUser) {
        loadUserSession(currentUser.uid);
      } else {
        setActivities([]);
        setLogs([]);
      }
    });

    return () => {
      clearTimeout(timeoutTimer);
      unsubscribe();
    };
  }, []);

  // Sync / Load data dynamically from user subcollection on Firestore
  const loadUserSession = async (uid: string) => {
    setSyncing(true);
    setSyncError(false);
    try {
      // 1. Fetch customized activities
      const actsPath = `users/${uid}/activities`;
      let actsSnapshot;
      try {
        actsSnapshot = await getDocs(collection(db, "users", uid, "activities"));
      } catch (e) {
        setSyncError(true);
        handleFirestoreError(e, OperationType.GET, actsPath);
        return;
      }

      let loadedActs: Activity[] = [];
      actsSnapshot.forEach((docSnap) => {
        loadedActs.push(docSnap.data() as Activity);
      });

      // Seeding step for new accounts (or if activities were deleted)
      if (loadedActs.length === 0) {
        loadedActs = [...INITIAL_ACTIVITIES];
        for (const act of INITIAL_ACTIVITIES) {
          const actPath = `users/${uid}/activities/${act.id}`;
          try {
            await setDoc(doc(db, "users", uid, "activities", act.id), act);
          } catch (e) {
            setSyncError(true);
            handleFirestoreError(e, OperationType.WRITE, actPath);
          }
        }
      } else {
        // Automatically inject missing default activities (like the newly added Baby Shower) into existing accounts
        const missingDefaults = INITIAL_ACTIVITIES.filter(
          (initAct) => !loadedActs.some((loaded) => loaded.id === initAct.id)
        );
        if (missingDefaults.length > 0) {
          for (const missingAct of missingDefaults) {
            const actPath = `users/${uid}/activities/${missingAct.id}`;
            try {
              await setDoc(doc(db, "users", uid, "activities", missingAct.id), missingAct);
              loadedActs.push(missingAct);
            } catch (e) {
              console.warn("Failed to seed missing default activity on sync:", missingAct.id, e);
            }
          }
        }
      }

      // 2. Fetch log history records
      const logsPath = `users/${uid}/logs`;
      let logsSnapshot;
      try {
        logsSnapshot = await getDocs(collection(db, "users", uid, "logs"));
      } catch (e) {
        setSyncError(true);
        handleFirestoreError(e, OperationType.GET, logsPath);
        return;
      }

      const loadedLogs: ActivityLog[] = [];
      logsSnapshot.forEach((docSnap) => {
        loadedLogs.push(docSnap.data() as ActivityLog);
      });

      // Sort logs descending by timestamp
      loadedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(loadedActs);
      setLogs(loadedLogs);
      setSyncError(false);
    } catch (err) {
      console.error("Firebase syncing failed:", err);
      setSyncError(true);
      showToast("Sincronizzazione fallita. Verifica le credenziali.", "error");
    } finally {
      setSyncing(false);
    }
  };

  // Toast trigger helper
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Activity Actions
  const handleAddNewActivityClick = () => {
    setActivityToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditActivityClick = (activity: Activity) => {
    setActivityToEdit(activity);
    setIsFormOpen(true);
  };

  const handleSaveActivity = async (name: string, iconName: string, color: string) => {
    if (!user) return;

    if (activityToEdit) {
      // Modify activity: local state update
      const updated = activities.map((act) =>
        act.id === activityToEdit.id ? { ...act, name, iconName, color } : act
      );
      setActivities(updated);

      // Firestore update
      const actPath = `users/${user.uid}/activities/${activityToEdit.id}`;
      try {
        await updateDoc(doc(db, "users", user.uid, "activities", activityToEdit.id), { name, iconName, color });
        setSyncError(false);
      } catch (e) {
        setSyncError(true);
        handleFirestoreError(e, OperationType.UPDATE, actPath);
      }

      // Cascade update logs snapshot matching this activity to persist name change
      const updatedLogs = logs.map((log) =>
        log.activityId === activityToEdit.id
          ? { ...log, activityName: name, iconName, color }
          : log
      );
      setLogs(updatedLogs);

      // Cascade update on Firestore matching ones
      const affectedLogs = logs.filter((l) => l.activityId === activityToEdit.id);
      for (const logItem of affectedLogs) {
        const logPath = `users/${user.uid}/logs/${logItem.id}`;
        try {
          await updateDoc(doc(db, "users", user.uid, "logs", logItem.id), { activityName: name, iconName, color });
          setSyncError(false);
        } catch (e) {
          setSyncError(true);
          handleFirestoreError(e, OperationType.UPDATE, logPath);
        }
      }

      showToast(`Attività "${name}" modificata con successo`, "success");
    } else {
      // Add activity
      const newId = "act_" + Date.now();
      const newAct: Activity = {
        id: newId,
        name,
        iconName,
        color,
        isCustom: true,
      };
      setActivities([...activities, newAct]);

      const actPath = `users/${user.uid}/activities/${newId}`;
      try {
        await setDoc(doc(db, "users", user.uid, "activities", newId), newAct);
        setSyncError(false);
      } catch (e) {
        setSyncError(true);
        handleFirestoreError(e, OperationType.CREATE, actPath);
      }

      showToast(`Attività "${name}" aggiunta alla griglia`, "success");
    }
  };

  const handleDeleteActivity = (id: string) => {
    const actToDelete = activities.find((a) => a.id === id);
    if (!actToDelete || !user) return;

    setConfirmModal({
      isOpen: true,
      title: "Elimina Attività",
      message: `Sei sicuro di voler eliminare definitivamente l'attività "${actToDelete.name}"? Le registrazioni esistenti nel diario non verranno rimosse, ma l'attività sparirà dalla pulsantiera.`,
      confirmText: "Elimina",
      onConfirm: async () => {
        const filtered = activities.filter((act) => act.id !== id);
        setActivities(filtered);

        const actPath = `users/${user.uid}/activities/${id}`;
        try {
          await deleteDoc(doc(db, "users", user.uid, "activities", id));
          setSyncError(false);
        } catch (e) {
          setSyncError(true);
          handleFirestoreError(e, OperationType.DELETE, actPath);
        }

        showToast(`Attività "${actToDelete.name}" rimossa`, "info");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Logging actions
  const handleSelectActivityToLog = async (activity: Activity) => {
    if (!user) return;

    // Play tactile sound confirm chime
    playSuccessSound();

    // Trigger visual pop modal confirmation with feedback
    setLoggedActivityFeedback(activity);
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = setTimeout(() => {
      setLoggedActivityFeedback(null);
    }, 2000);

    const now = new Date();
    const offset = now.getTimezoneOffset();
    const dateTimeStr = new Date(now.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 16);

    const newLog: ActivityLog = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      activityId: activity.id,
      activityName: activity.name,
      iconName: activity.iconName,
      color: activity.color,
      timestamp: now.toISOString(),
      dateTimeStr,
      notes: "",
    };

    setLogs([newLog, ...logs]);

    const logPath = `users/${user.uid}/logs/${newLog.id}`;
    try {
      await setDoc(doc(db, "users", user.uid, "logs", newLog.id), newLog);
      setSyncError(false);
    } catch (e) {
      setSyncError(true);
      handleFirestoreError(e, OperationType.CREATE, logPath);
    }

    showToast(`Registrato: ${activity.name}. Scrivi una nota se vuoi!`, "success");
  };

  const handleUpdateLog = async (id: string, updatedFields: Partial<ActivityLog>) => {
    if (!user) return;

    const updated = logs.map((log) =>
      log.id === id ? { ...log, ...updatedFields } : log
    );
    setLogs(updated);

    const logPath = `users/${user.uid}/logs/${id}`;
    try {
      await updateDoc(doc(db, "users", user.uid, "logs", id), updatedFields);
      setSyncError(false);
    } catch (e) {
      setSyncError(true);
      handleFirestoreError(e, OperationType.UPDATE, logPath);
    }
  };

  const handleDeleteLog = (id: string) => {
    const logToDelete = logs.find((l) => l.id === id);
    if (!logToDelete || !user) return;

    setConfirmModal({
      isOpen: true,
      title: "Rimuovi Registrazione",
      message: `Rimuovere definitivamente questa registrazione di "${logToDelete.activityName}" dal diario delle attività? L'operazione non può essere annullata.`,
      confirmText: "Sì, Rimuovi",
      onConfirm: async () => {
        const filtered = logs.filter((log) => log.id !== id);
        setLogs(filtered);

        const logPath = `users/${user.uid}/logs/${id}`;
        try {
          await deleteDoc(doc(db, "users", user.uid, "logs", id));
          setSyncError(false);
        } catch (e) {
          setSyncError(true);
          handleFirestoreError(e, OperationType.DELETE, logPath);
        }

        showToast("Registrazione eliminata dal diario", "info");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Helper stats computed values
  const getTodayLogsCount = () => {
    const todayStr = new Date().toDateString();
    return logs.filter((log) => new Date(log.timestamp).toDateString() === todayStr).length;
  };

  const getMostFrequentActivityName = () => {
    if (logs.length === 0) return "Nessuna";
    const counts: Record<string, number> = {};
    logs.forEach((l) => {
      counts[l.activityName] = (counts[l.activityName] || 0) + 1;
    });
    
    let maxName = "";
    let maxVal = 0;
    Object.entries(counts).forEach(([name, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxName = name;
      }
    });

    return maxVal > 0 ? `${maxName} (${maxVal} volte)` : "Nessuna";
  };

  const handleResetData = () => {
    if (!user) return;

    setConfirmModal({
      isOpen: true,
      title: "Ripristina Dati Iniziali",
      message: "Attenzione: questo cancellerà definitivamente tutto lo storico delle registrazioni e ripristinerà le attività predefinite di sistema nel Cloud. L'operazione è irreversibile.",
      confirmText: "Ripristina tutto",
      onConfirm: async () => {
        setSyncing(true);
        try {
          // Clear logs in database
          for (const logItem of logs) {
            const logPath = `users/${user.uid}/logs/${logItem.id}`;
            await deleteDoc(doc(db, "users", user.uid, "logs", logItem.id));
          }
          setLogs([]);

          // Clear custom activities in database
          for (const act of activities) {
            await deleteDoc(doc(db, "users", user.uid, "activities", act.id));
          }

          // Re-seed defaults
          for (const dact of INITIAL_ACTIVITIES) {
            await setDoc(doc(db, "users", user.uid, "activities", dact.id), dact);
          }
          setActivities(INITIAL_ACTIVITIES);

          setSyncError(false);
          showToast("Tutti i dati sono stati resettati a quelli originali sul cloud", "info");
        } catch (e) {
          console.error("Reset data error:", e);
          setSyncError(true);
          showToast("Impossibile completare il ripristino dei dati.", "error");
        } finally {
          setSyncing(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: "Esci dall'Account",
      message: "Sei sicuro di voler uscire dal tuo account personalizzato?",
      confirmText: "Esci",
      onConfirm: async () => {
        try {
          await signOut(auth);
          showToast("Disconnessione completata con successo", "info");
        } catch (e) {
          showToast("Impossibile effettuare la disconnessione.", "error");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    setConfirmModal({
      isOpen: true,
      title: "Elimina Account",
      message: "ATTENZIONE: Sei sicuro di voler eliminare definitivamente il tuo account? Tutti i dati personali inseriti, le attività personalizzate e lo storico delle registrazioni saranno cancellati per sempre dal Cloud in modo irreversibile.",
      confirmText: "Elimina definitivamente",
      cancelText: "Annulla",
      onConfirm: async () => {
        setSyncing(true);
        try {
          const uid = user.uid;

          // 1. Delete all activities in Firestore for this user
          const actsSnapshot = await getDocs(collection(db, "users", uid, "activities"));
          for (const docSnap of actsSnapshot.docs) {
            await deleteDoc(doc(db, "users", uid, "activities", docSnap.id));
          }

          // 2. Delete all logs in Firestore for this user
          const logsSnapshot = await getDocs(collection(db, "users", uid, "logs"));
          for (const docSnap of logsSnapshot.docs) {
            await deleteDoc(doc(db, "users", uid, "logs", docSnap.id));
          }

          // 3. Delete user account from Auth
          await deleteUser(user);
          showToast("Account e dati eliminati con successo.", "info");
        } catch (error: any) {
          console.error("Account deletion failed:", error);
          if (error.code === "auth/requires-recent-login") {
            showToast("Per motivi di sicurezza, effettua di nuovo l'accesso prima di procedere.", "error");
          } else {
            showToast("Impossibile completare l'eliminazione dell'account.", "error");
          }
        } finally {
          setSyncing(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Full Screen Authentication Loading State
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_center,_#fffdfd_0%,_#ffeef1_40%,_#ffd3da_100%)] flex flex-col items-center justify-center text-pink-600 gap-4">
        <Loader2 className="w-10 h-10 animate-spin stroke-[2]" />
        <p className="text-xs font-black uppercase tracking-widest text-pink-700/75 animate-pulse">Caricamento in corso...</p>
      </div>
    );
  }

  // Not Logged In Switch Rule
  if (!user) {
    // The onAuthStateChanged listener handles user state changes automatically
    return <LoginScreen onLoginSuccess={() => {}} />;
  }

  return (
    <div 
      className="min-h-screen font-sans bg-[radial-gradient(circle_at_center,_#fffdfd_0%,_#ffeef1_40%,_#ffd3da_100%)] text-gray-800 flex flex-col selection:bg-pink-200 selection:text-pink-900"
      id="main-app-container"
    >
      {/* Header Bar */}
      <header className={`w-full border-b border-pink-100/55 bg-white/70 backdrop-blur-md sticky top-0 z-40 transition-all duration-300 ease-in-out shadow-xs ${
        shrinkLogo ? "py-2 px-4 md:px-8" : "py-4 px-4 md:px-8"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 transition-all duration-300">
            <div className={`bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-100 transition-all duration-300 ${
              shrinkLogo ? "w-8 h-8 rounded-xl" : "w-10 h-10 rounded-2xl"
            }`}>
              <ActivityIcon className={`stroke-[2] transition-all duration-300 ${
                shrinkLogo ? "w-4.5 h-4.5" : "w-5.5 h-5.5"
              }`} />
            </div>
            <div className="transition-all duration-300">
              <h1 className={`font-bold tracking-tight bg-gradient-to-r from-pink-700 to-rose-600 bg-clip-text text-transparent transition-all duration-300 ${
                shrinkLogo ? "text-base" : "text-xl"
              }`}>
                Diario delle Attività
              </h1>
              <p className="text-pink-500/80 flex items-center gap-1 font-bold transition-all duration-300">
                <UserIcon className={`text-pink-500 transition-all duration-300 ${
                  shrinkLogo ? "w-2.5 h-2.5" : "w-3 h-3"
                }`} />
                <span className={`uppercase tracking-wider font-extrabold transition-all duration-300 ${
                  shrinkLogo ? "text-[8px]" : "text-[10px]"
                }`}>
                  Account: {user.displayName || user.email}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Real-time Cloud Synchronization Indicator (Green = Connected/Synced, Amber = Syncing, Red = Offline/Error) */}
            <div className="relative group" id="cloud-sync-status-indicator">
              {syncError ? (
                <div 
                  className="p-2 rounded-xl bg-rose-50 border border-rose-100/80 text-rose-500 shadow-sm flex items-center justify-center transition-all animate-pulse cursor-pointer relative"
                  title="Errore di caricamento o sincronizzazione con Firestore. Controlla la connessione."
                  onClick={() => loadUserSession(user.uid)}
                >
                  <CloudOff className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-600 border border-white" />
                </div>
              ) : (
                <div 
                  className={`p-2 rounded-xl transition-all flex items-center justify-center border shadow-sm relative ${
                    syncing 
                      ? "bg-amber-50 border-amber-100 text-amber-500 cursor-wait" 
                      : "bg-emerald-50 border-emerald-100 text-emerald-500"
                  }`}
                  title={syncing ? "Sincronizzazione cloud in corso..." : "Sincronizzato con Cloud Firestore in tempo reale"}
                >
                  <Cloud className={`w-4 h-4 ${syncing ? "animate-bounce" : ""}`} />
                  <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                    syncing ? "bg-amber-400 animate-ping" : "bg-emerald-500"
                  }`} />
                </div>
              )}
            </div>

            {/* Reset Data Button */}
            <button
              onClick={handleResetData}
              disabled={syncing}
              className="p-2 h-9 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer text-xs font-bold flex items-center gap-1 border border-transparent hover:border-pink-100"
              title="Resetta dati alle impostazioni iniziali sul cloud"
              id="reset-data-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ripristina</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 h-9 rounded-xl text-gray-500 hover:text-pink-700 hover:bg-pink-100/50 transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5 border border-pink-100"
              title="Esci dal tuo account personalizzato"
              id="logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Esci</span>
            </button>
          </div>
        </div>
      </header>
 
      {/* Main Content Dashboard */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
         {/* Section 1: Interactive Activities Grid */}
        <section className="space-y-3">
          <ActivityGrid
            activities={activities}
            logs={logs}
            onSelectActivity={handleSelectActivityToLog}
            onEditActivity={handleEditActivityClick}
            onDeleteActivity={handleDeleteActivity}
            onAddNewClick={handleAddNewActivityClick}
          />
        </section>
 
        {/* Section 2: Tabulated Activity Logs List */}
        <section className="space-y-3">
          <ActivityLogList
            logs={logs}
            onUpdateLog={handleUpdateLog}
            onDeleteLog={handleDeleteLog}
          />
        </section>
      </main>
 
      {/* Activity Modificare Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <ActivityForm
            activityToEdit={activityToEdit}
            onSave={handleSaveActivity}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>
 
      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <ConfirmModal
            isOpen={confirmModal.isOpen}
            title={confirmModal.title}
            message={confirmModal.message}
            confirmText={confirmModal.confirmText}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
          />
        )}
      </AnimatePresence>
 
      {/* Floating Interactive Toasts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border bg-white/95 backdrop-blur-md text-gray-800 border-pink-100"
            id="toast-notification"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            <span className="text-xs font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2-Second Super Animated Success Feedback Modal */}
      <AnimatePresence>
        {loggedActivityFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-md"
            id="activity-logged-feedback-overlay"
          >
            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 40 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0, 
                transition: { type: "spring", damping: 15, stiffness: 320 } 
              }}
              exit={{ 
                scale: 0.85, 
                opacity: 0, 
                y: -30, 
                transition: { duration: 0.18, ease: "easeInOut" } 
              }}
              className="bg-white/95 border border-pink-100/60 rounded-[36px] p-8 max-w-xs w-full text-center shadow-2xl flex flex-col items-center gap-5 relative overflow-hidden"
            >
              {/* Dynamic decorative backdrop ambient lighting matching user theme color */}
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-pink-400/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-rose-400/10 blur-2xl pointer-events-none" />

              <div className="relative">
                {/* Scaled App-store style Squircle of the Registered Activity */}
                <motion.div
                  initial={{ scale: 0.4, rotate: -15 }}
                  animate={{ scale: [1, 1.15, 1], rotate: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`w-20 h-20 rounded-[22%] flex items-center justify-center border font-bold ${
                    PASTEL_COLORS.find(c => c.id === loggedActivityFeedback.color)?.bg || "bg-pink-50"
                  } ${
                    PASTEL_COLORS.find(c => c.id === loggedActivityFeedback.color)?.text || "text-pink-600"
                  } ${
                    PASTEL_COLORS.find(c => c.id === loggedActivityFeedback.color)?.border || "border-pink-200"
                  } shadow-md`}
                >
                  <IconRenderer name={loggedActivityFeedback.iconName} className="w-10 h-10 stroke-[1.8]" />
                </motion.div>

                {/* Sparkling overlays */}
                <div className="absolute -top-1.5 -right-1.5 text-rose-500 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-600">Registrato con Successo!</p>
                <h3 className="text-xl font-extrabold text-slate-800 capitalize leading-tight">
                  {loggedActivityFeedback.name}
                </h3>
              </div>

              {/* 2-second visual draining progress bar */}
              <div className="w-full bg-gray-100/80 rounded-full h-1 mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 2.0, ease: "linear" }}
                  className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full" 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Footer */}
      <footer className="py-8 text-center text-[11px] font-medium text-pink-700/60 mt-auto flex flex-col items-center gap-1.5 px-4" id="app-footer-credit text-center">
        <p>© 2026 Diario delle Attività — Sincronizzato con Cloud Firestore in tempo reale.</p>
        <p>
          Ideato e creato da{" "}
          <a 
            href="mailto:castromassimo@gmail.com" 
            className="text-pink-600 hover:text-pink-800 font-bold underline decoration-pink-300 underline-offset-2 transition-colors cursor-pointer"
          >
            Castro massimo by DEVTOOLS
          </a>
        </p>
        <button
          onClick={handleDeleteAccount}
          className="mt-2 text-[10px] font-bold text-rose-500 hover:text-rose-700 hover:underline transition-all cursor-pointer flex items-center gap-1 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/40 hover:border-rose-200 px-3 py-1 rounded-full shadow-2xs hover:scale-102 active:scale-98"
          title="Elimina definitivamente il tuo account e tutti i dati dal Cloud"
          id="delete-account-footer-btn"
        >
          <span>Elimina Account</span>
        </button>
      </footer>
    </div>
  );
}
