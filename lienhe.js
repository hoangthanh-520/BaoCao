
document.addEventListener("DOMContentLoaded", function () {

    var form = document.getElementById("contactForm");
    var name = document.getElementById("name");
    var phone = document.getElementById("phone");
    var email = document.getElementById("email");
    var message = document.getElementById("message");

    function checkName() {
        if (name.value.trim() === "" || name.value.trim().length < 4) {
            alert("Vui lòng nhập họ và tên (ít nhất 4 ký tự)");
            name.focus();
            return false;
        }
        return true;
    }

    function checkPhone() {
        var phoneReg = /^[0-9]{10}$/;
        if (!phoneReg.test(phone.value)) {
            alert("Số điện thoại phải gồm 10 chữ số");
            phone.focus();
            return false;
        }
        return true;
    }

    function checkEmail() {
        var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailReg.test(email.value)) {
            alert("Email không hợp lệ");
            email.focus();
            return false;
        }
        return true;
    }

    function checkMessage() {
        if (message.value.trim().length < 10) {
            alert("Nội dung phải ít nhất 10 ký tự");
            message.focus();
            return false;
        }
        return true;
    }

    form.addEventListener("submit", function (e) {
        if (!checkName() || !checkPhone() || !checkEmail() || !checkMessage()) {
            e.preventDefault();
        } else {
            alert("Gửi thông tin thành công!");
        }

    });

});