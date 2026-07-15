// Session checker helper
function checkSession() {
    try {
        const sessionStr = localStorage.getItem('user_session');
        if (!sessionStr) {
            console.log("Session not found, redirecting to login.");
            window.location.href = './login.html';
            return null;
        }

        const session = JSON.parse(sessionStr);
        if (!session || !session.expiry || Date.now() > session.expiry) {
            console.log("Session expired or invalid, cleaning up and redirecting to login.");
            localStorage.removeItem('user_session');
            window.location.href = './login.html';
            return null;
        }

        console.log("Phiên còn hợp lệ");
        return session;
    } catch (e) {
        console.error("Session verification error:", e);
        localStorage.removeItem('user_session');
        window.location.href = './login.html';
        return null;
    }
}
