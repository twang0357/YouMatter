document.getElementById('changepassword-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if(newPassword !== confirmPassword){
        alert("New passwords do not match. Try again!");
        return;
    }

    try{
        const response = await fetch('http://localhost:3000/change-password',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                currentPassword,
                newPassword
            })
        });

        const result = await response.json();
        
        if (response.ok){
            alert('Password Changed!');
            window.location.href = '/Login-Page/login.html';
        }
        else{
            alert(result.message);
        }
    } catch(error){
        alert(`Error : ${error.message}`);
    }
});