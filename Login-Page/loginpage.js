document.getElementById('login-form').addEventListener('submit' , async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });
        const data = await response.json();

        if(response.ok){
            alert("Successful Login");
            window.location.href = '/Home-Page/homepage.html';
        } else{
            alert(data.error);
        }
    } catch (error){
        alert(`Error: ${error.message}`);
    }
});