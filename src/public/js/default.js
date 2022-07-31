function showpassword() {
    var input = document.getElementById('password');
    if (input.type === 'password') {
        input.type = 'text';
        document.getElementById('hide').style.display = 'inline-block';
        document.getElementById('show').style.display = 'none';
    } else {
        input.type = 'password';
        document.getElementById('hide').style.display = 'none';
        document.getElementById('show').style.display = 'inline-block';
    }
}

function showConfirmPassword() {
    var confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword.type === 'password') {
        confirmPassword.type = 'text';
        document.getElementById('confirm-hide').style.display = 'inline-block';
        document.getElementById('confirm-show').style.display = 'none';
    } else {
        confirmPassword.type = 'password';
        document.getElementById('confirm-hide').style.display = 'none';
        document.getElementById('confirm-show').style.display = 'inline-block';
    }
}