//

const medications = [
    { name: "Aspirin", time: "08:00 AM" },
    { name: "Paracetamol", time: "01:00 PM" }
];

console.log("addmed side: ", medications);
//

const form = document.getElementById('add-medication-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const medication = {
        name: document.getElementById("medication-name").value.trim(),
        start_date: document.getElementById("start-date").value,
        times_per_day: parseInt(document.getElementById("times_day_day").value),
        dosage: parseFloat(document.getElementById("dosage").value),
        dosage_unit: document.getElementById("dosage-unit").value,
        quantity: parseInt(document.getElementById("quantity").value),
        importance: document.getElementById("importance").value,
        account_id: localStorage.getItem("account_id")
    };

    console.log("Account ID:", medication.account_id);
    
    try{
        const response = await fetch("http://localhost:3000/medications", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(medication)
        });

        const result = await response.json();

        if(response.ok){
            alert("Medication Add Success!");
            window.location.href = "../Home-Page/homepage.html";
        }else {
            alert("Error: " + result.message);
        }
    } catch(err){
        alert("something went wrong"+ err.message);
    }
});