document.addEventListener('DOMContentLoaded', () => {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification was granted!');
        } else {
          alert('Please enable notifications for reminders to work.');
        }
      });

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

    async function getMedications() {
        try {
            const response = await fetch(`http://localhost:3000/medications/today/${accountID}`);
            const medications = await response.json();
            console.log("homepage side test:", medications);

            const medicationList = document.getElementById('medication-list');
            medicationList.innerHTML = '';
            
            medications.forEach((medication) => {
                const li = document.createElement('li');
                const totalDaysLeft = medication.quantity / medication.times_per_day;
        
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
            
                let nextReminder = medication.reminder_times.find(time => {
                    const [hour, minute] = time.split(':').map(Number);
                    const timeMinutes = hour * 60 + minute;
                    return timeMinutes > currentMinutes;
                });
            
                nextReminder = nextReminder || "No more reminders today";
            
                let reminderHTML = `<span class="med-time">${nextReminder}</span>`;
            
                li.innerHTML = `
                <div class="medication-item">
                    <span class="med-name">${medication.name}</span>
                    <span class="med-dosage">${medication.dosage} ${medication.dosage_unit}</span>
                    ${reminderHTML}
                    <button class="remove-med-btn" data-id="${medication.medication_id}">Remove</button>
                </div>`;
            
                medicationList.appendChild(li);

                const removeBtn = li.querySelector('.remove-med-btn');
                removeBtn.addEventListener('click', async (e) => {
                    const medId = e.target.dataset.id;
                    try {
                        const res = await fetch(`http://localhost:3000/medications/${medId}`, {
                            method: 'DELETE'
                        });
                        if (res.ok) {
                            getMedications();
                        } else {
                            alert('Failed to delete medication.');
                        }
                    } catch (err) {
                        alert('Error deleting medication: ' + err.message);
                    }
                });
            });
        } catch (error) {
            alert('Error fetching medication: ' + error.message);
        }
    }

    // Run functions
    getuserInfo();
    getMedications();
    
    const notifSet = new Set();

    setInterval(async () => {
        try {
            const response = await fetch(`http://localhost:3000/medications/today/${accountID}`);
            const medications = await response.json();
    
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5);
    
            medications.forEach(medication => {
                const uniqueNotification = `${medication.medication_id}-${currentTime}`;
                if (medication.reminder_times.includes(currentTime) && !notifSet.has(uniqueNotification)) {
                    new Notification("Medication Reminder", {
                        body: `Time to take ${medication.name} - ${medication.dosage} ${medication.dosage_unit}`,
                    });
                    notifSet.add(uniqueNotification);
                }
            });
        } catch (error) {
            console.error("Error checking reminder notifications:", error);
        }
    }, 10000)

    setInterval(()=> {
        notifSet.clear()
    }, 3600000)
    
    setInterval(getMedications, 60000);
});