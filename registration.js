import {
    getApp,
    getApps,
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
    addDoc,
    collection,
    getFirestore,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const registrationForm = document.querySelector("#registrationForm");
const registrationStatus = document.querySelector("#registrationStatus");

function showStatus(message, state) {
    registrationStatus.textContent = message;
    registrationStatus.dataset.state = state;
}

function hasFirebaseConfig() {
    return ["apiKey", "projectId", "appId"].every(
        (key) => firebaseConfig[key].trim().length > 0
    );
}

if (registrationForm && registrationStatus) {
    registrationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!registrationForm.reportValidity()) {
            return;
        }

        if (!hasFirebaseConfig()) {
            showStatus(
                "Online registration is not configured yet. Add your Firebase web app settings to firebase-config.js.",
                "error"
            );
            return;
        }

        const submitButton = registrationForm.querySelector('[type="submit"]');
        const formData = new FormData(registrationForm);
        const registration = {
            fullName: String(formData.get("fullName")).trim(),
            email: String(formData.get("email")).trim().toLowerCase(),
            phone: String(formData.get("phone")).trim(),
            institution: String(formData.get("institution")).trim(),
            interest: String(formData.get("interest")),
            consent: formData.get("consent") === "on",
            createdAt: serverTimestamp()
        };

        submitButton.disabled = true;
        showStatus("Submitting your registration…", "pending");

        try {
            const app = getApps().length > 0
                ? getApp()
                : initializeApp(firebaseConfig);
            const database = getFirestore(app);
            await addDoc(collection(database, "registrations"), registration);
            registrationForm.reset();
            showStatus("Registration received. Thanks for joining the Techfest experience!", "success");
        } catch (error) {
            console.error("Could not save the Techfest registration to Firestore.", error);
            showStatus(
                "We couldn’t save your registration. Please check the Firebase setup and try again.",
                "error"
            );
        } finally {
            submitButton.disabled = false;
        }
    });
}
