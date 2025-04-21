document.addEventListener('DOMContentLoaded', () => {


    const accountID = localStorage.getItem('account_id');

    if(!accountID){
        window.location.href = '/Login-Page/login.html';
    }

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('account_id');
        window.location.href = '../Login-Page/login.html';
    });

    document.getElementById('add-medication-button').addEventListener('click', () => {
        window.location.href = '../Add-Medication-Page/addmed.html'
    });
    
    async function getuserInfo(){
        try {
            const response = await fetch(`http://localhost:3000/user/${accountID}`);
            const data = await response.json();
            if(response.ok){
                document.getElementById('userFName').textContent = data.fname;
            } 
            else {
                alert('Error getting account info');
            }
        } catch (error){
            alert('Error:' + error.message);
        }
    }

    async function getMedications(){
        try{
            const response = await fetch(`http://localhost:3000/medications/today/${accountID}`);
            const medications = await response.json();
            console.log("homepage side test:", medications);
            
            const medicationList = document.getElementById('medication-list');
        
        medications.forEach((medication) => {
            const li = document.createElement('li');
            li.innerHTML = `
            <div class = "medication-item">
                <span class="med-name">${medication.name}</span>
                <span class="med-time">${medication.time}</span>
                <input type="checkbox" class ="med-checkbox">
            </div> `;
            medicationList.appendChild(li);
        });
    } catch (error) {
        alert('Error fetching medication: ' + error.message);
    }
}

//run functions

getuserInfo();
getMedications();
});