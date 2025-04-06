document.getElementById('signup-form').addEventListener('submit' , async(e) => {
    e.preventDefault();

    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if(password !== confirmPassword){
        alert("Password need to match");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/accounts', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fname,
                lname,
                email,
                password
            })            
        });

        const data= await response.json();

        if(response.ok){
            alert('Account created!');
            window.location.href = '/Login-Page/login.html';
        }
        } catch (error) {
            alert(`Error : ${error.message}`);
        }
    }
);