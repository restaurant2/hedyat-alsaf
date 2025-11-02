# هدية الصف للمربي

موقع React (Vite) + Firebase (Firestore + Storage) لجمع رسائل صوتية من الطلاب للأستاذ.

## الإعداد السريع

1) ثبّت الاعتمادات:
```bash
npm install
```

2) ضع مفاتيح Firebase في `src/firebase.js`:
```js
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
}
```

3) شغّل محليًا:
```bash
npm run dev
```

4) انشر على Vercel أو Firebase Hosting.

## قواعد الأمان المقترحة (Firestore)
اجعل القراءة متاحة للجميع، والكتابة محدودة (حسب احتياجك). مثال بسيط (طوّره لاحقًا):
```
match /databases/{database}/documents {
  match /voices/{docId} {
    allow read: if true;
    allow create: if request.time < timestamp.date(2030,1,1);
    allow update, delete: if false;
  }
}
```

## ملاحظات
- المتصفحات قد تمنع تشغيل الموسيقى تلقائيًا؛ يوجد زر تشغيل يظهر إن تم المنع.
- التسجيل بصيغة webm. يمكن تغيير الصيغة حسب دعم المتصفح.
