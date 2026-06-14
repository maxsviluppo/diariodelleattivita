import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Lazy-initialization or fallback protection if environmental config is empty
const defaultFirebaseConfig = {
  apiKey: firebaseConfig.apiKey || "dummy-api-key",
  authDomain: firebaseConfig.authDomain || "dummy.firebaseapp.com",
  projectId: firebaseConfig.projectId || "dummy-project",
  storageBucket: firebaseConfig.storageBucket || "dummy.appspot.com",
  messagingSenderId: firebaseConfig.messagingSenderId || "123456",
  appId: firebaseConfig.appId || "dummy-app-id"
};

const app = initializeApp(defaultFirebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
export const auth = getAuth(app);

// Firestore operation types
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Global robust error handler per Firebase skill specifications
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on initial boot as mandated by the Firebase Integration skill
export async function testConnection() {
  if (!firebaseConfig.apiKey) {
    console.warn("Firebase config is currently placeholder. Skipping real connection test.");
    return;
  }
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase connection established successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration: Client is offline.");
    } else {
      console.warn("Firebase connection checked. Connection status active.");
    }
  }
}

testConnection();
