const signupForm = document.getElementById('signup-form');
const fnameInput = document.getElementById('fname');
const lnameInput = document.getElementById('lname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const signupButton = document.getElementById('Signup-button');

signupForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const firstName = fnameInput.value.trim();
    const lastName = lnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if(!firstName || !lastName || !email || !password || !confirmPassword){
        alert("Please fill in the complete form");
        signupButton.disabled = false;
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match");
        signupButton.disabled = false;
        return;
    }

    if(password.length < 8) {
        alert("Password must be at least 8 characters long");
        signupButton.disabled = false;
        return;
    }
    
    signupButton.disabled = true;

// using my local server for now, need to change later
const response = await fetch('http://localhost:5000/accounts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        firstName,
        lastName,
        email,
        password
    })
});

const data = await response.json();

if(response.ok){
// page will be actual site page when deployment happens
window.location.href = '../Login-Page/login.html';
}else{
//error msg to test my server for now
alert("server error, didnt work");
}
signupButton.disabled = false;

});




