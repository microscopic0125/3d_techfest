# Firebase registration setup

The registration form writes each submission to the Firestore `registrations` collection. Online writes are disabled until the Firebase web app settings are added.

1. Create a Firebase project, add a Web app, and create a Cloud Firestore database.
2. Copy the Web app configuration into `firebase-config.js`. These client settings identify the Firebase project; they do not replace Firestore security rules.
3. In Firestore Rules, use restrictive create-only rules such as the following. They allow a valid registration to be submitted but do not allow public reads, edits, or deletes:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{registrationId} {
      allow create: if request.resource.data.keys().hasAll([
          'fullName', 'email', 'phone', 'institution', 'interest', 'consent', 'createdAt'
        ])
        && request.resource.data.keys().hasOnly([
          'fullName', 'email', 'phone', 'institution', 'interest', 'consent', 'createdAt'
        ])
        && request.resource.data.fullName is string
        && request.resource.data.fullName.size() > 0
        && request.resource.data.fullName.size() <= 100
        && request.resource.data.email is string
        && request.resource.data.email.size() <= 254
        && request.resource.data.phone is string
        && request.resource.data.phone.size() >= 7
        && request.resource.data.phone.size() <= 20
        && request.resource.data.institution is string
        && request.resource.data.institution.size() > 0
        && request.resource.data.institution.size() <= 120
        && request.resource.data.interest in [
          'Competitions', 'Workshops', 'Exhibitions', 'All events'
        ]
        && request.resource.data.consent == true
        && request.resource.data.createdAt == request.time;
      allow read, update, delete: if false;
    }
  }
}
```

4. Enable Firebase App Check for the deployed site to help protect the public registration endpoint from automated abuse. Do not use open read/write test rules in production.

Run the site from a local or hosted web server (not `file://`) so the Firebase ES modules can load.
