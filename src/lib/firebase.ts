import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// Initialize Firestore using databaseId/settings to force experimental long polling
// This bypasses WebSocket limitations within container-proxy environments (Cloud Run sandbox)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || "default");

export const auth = getAuth(app);

// Connectivity check based on skill instructions
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firebase offline during client startup. Client may be running locally without internet or backend config is pending validation.");
    }
  }
}
testConnection();
