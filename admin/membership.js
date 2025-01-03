document.addEventListener("DOMContentLoaded", function() {
    // Fetch members from the backend
    fetch('http://127.0.0.1:5000/get-membership')
        .then(response => response.json())
        .then(memberships => {
            // Get the container to display members
            const membersContainer = document.getElementById('members-container');
            
            // If no memberships found, show a message
            if (memberships.length === 0) {
                membersContainer.innerHTML = "<p>No memberships found.</p>";
                return;
            }

            // Loop through each membership and create HTML elements
            memberships.forEach(member => {
                const memberCard = document.createElement('div');
                memberCard.classList.add('member-card');
                
                // Add member details inside the card
                memberCard.innerHTML = `
                    <h3>${member.name}</h3>
                    <p><strong>Email:</strong> ${member.email}</p>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><strong>Plan:</strong> ${member.planName} - $${member.planPrice}</p>
                    <p><strong>Address:</strong> ${member.address}</p>
                `;
                
                // Append the member card to the container
                membersContainer.appendChild(memberCard);
            });
        })
        .catch(error => {
            console.error("Error fetching membership data:", error);
        });
});
