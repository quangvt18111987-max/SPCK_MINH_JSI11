document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!fullname || !email || !phone || !password || !confirmPassword) {
        alert("Vui lòng điền đầy đủ tất cả các trường!");
        return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        alert("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    if (password.length < 6) {
        alert("Mật khẩu phải dài từ 6 ký tự trở lên!");
        return;
    }

    try {
        // Create user in Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        const userData = {
            id: user.uid,
            fullName: fullname,
            phone: phone,
            email: email,
            password: password, // plaintext for learning purposes
            role_id: 2,         // 2 = Default User
            deposit: 0          // default deposit balance
        };

        // Save user details to Firestore
        await db.collection("users").doc(user.uid).set(userData);

        // Save user details to LocalDB for offline fallback
        window.LocalDB.add('users', userData);

        alert("Đăng ký thành công! Hãy đăng nhập.");
        window.location.href = './login.html';
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        if (error.code === 'auth/email-already-in-use') {
            alert("Email này đã được sử dụng bởi một tài khoản khác!");
        } else if (error.code === 'auth/weak-password') {
            alert("Mật khẩu quá yếu! Hãy chọn mật khẩu khác.");
        } else {
            // Lỗi khác (VD: chưa cấu hình Firebase, lỗi mạng), fallback sang LocalDB
            console.log("Firebase lỗi, fallback đăng ký qua LocalDB...", error);
            
            const localUsers = window.LocalDB.get('users');
            if (localUsers.some(u => u.email === email)) {
                alert("Email này đã được đăng ký (tài khoản cục bộ)!");
                return;
            }
            
            const userData = {
                fullName: fullname,
                phone: phone,
                email: email,
                password: password, 
                role_id: 2,         
                deposit: 0          
            };
            
            // LocalDB.add sẽ tự động sinh id và createdAt
            window.LocalDB.add('users', userData);
            alert("Đăng ký thành công (Chế độ Offline)! Hãy đăng nhập.");
            window.location.href = './login.html';
        }
    }
});
