document.addEventListener('DOMContentLoaded', function() {
    // 1. Auto-redirect if session is still valid
    const userSessionStr = localStorage.getItem('user_session');
    if (userSessionStr) {
        try {
            const session = JSON.parse(userSessionStr);
            if (session && session.expiry && Date.now() < session.expiry) {
                console.log("Session valid, auto-redirecting.");
                if (session.user.role_id === 1) {
                    window.location.href = './admin.html';
                } else {
                    window.location.href = './index.html';
                }
                return;
            }
        } catch (e) {
            localStorage.removeItem('user_session');
        }
    }

    // 2. Submit form handler
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert("Vui lòng điền đầy đủ Email và Mật khẩu!");
            return;
        }

        // Helper to set session and redirect
        const createSessionAndRedirect = (userData) => {
            const session = {
                user: {
                    uid: userData.id,
                    email: userData.email,
                    role_id: userData.role_id,
                    fullName: userData.fullName
                },
                expiry: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
            };
            localStorage.setItem('user_session', JSON.stringify(session));

            // Sync user to LocalDB (in case not present)
            const localUsers = window.LocalDB.get('users');
            const userIndex = localUsers.findIndex(u => u.email === userData.email);
            if (userIndex === -1) {
                window.LocalDB.add('users', userData);
            } else {
                window.LocalDB.update('users', localUsers[userIndex].id, userData);
            }

            alert(`Đăng nhập thành công! Xin chào ${userData.fullName}`);
            if (userData.role_id === 1) {
                window.location.href = './admin.html';
            } else {
                window.location.href = './index.html';
            }
        };

        // Fallback check: check LocalDB first for default admin bypass
        const localUsers = window.LocalDB.get('users');
        const localAdmin = localUsers.find(u => u.email === email && u.password === password && u.role_id === 1);
        if (localAdmin) {
            console.log("Logged in using local admin fallback.");
            createSessionAndRedirect(localAdmin);
            return;
        }

        // Firebase Auth login flow
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Retrieve user details from Firestore
            const doc = await db.collection("users").doc(user.uid).get();
            let userData;

            if (doc.exists) {
                userData = doc.data();
            } else {
                // If user authenticated in Firebase but no document in Firestore, create one
                userData = {
                    id: user.uid,
                    email: user.email,
                    fullName: user.email.split('@')[0],
                    phone: "",
                    password: password,
                    role_id: 2,
                    deposit: 0
                };
                await db.collection("users").doc(user.uid).set(userData);
            }

            createSessionAndRedirect(userData);
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            // Check if there is a local user registered in local db (offline fallback)
            const matchedLocalUser = localUsers.find(u => u.email === email && u.password === password);
            if (matchedLocalUser) {
                console.log("Logged in using local user database fallback.");
                createSessionAndRedirect(matchedLocalUser);
                return;
            }

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                alert("Email hoặc Mật khẩu không chính xác!");
            } else {
                alert("Lỗi đăng nhập: " + error.message);
            }
        }
    });
});
