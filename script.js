
document.addEventListener('DOMContentLoaded', () => {
    const navbarMenu = document.querySelector('.navbar-menu');
    const toggleButton = document.createElement('button');

    toggleButton.textContent = '☰';
    toggleButton.classList.add('navbar-toggle');
    document.querySelector('.navbar').appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        navbarMenu.classList.toggle('show');
    });
        const filterButtons = document.querySelectorAll('.filter-btn');
        const currentFilterText = document.getElementById('current-filter').querySelector('strong');
    
        // Add click event listener to each button
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove the 'active' class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add the 'active' class to the clicked button
                this.classList.add('active');
                
                // Get the category from the button's data-filter attribute
                const filterValue = this.getAttribute('data-filter');
                
                // Update the "Currently viewing" text dynamically
                currentFilterText.textContent = filterValue.charAt(0).toUpperCase() + filterValue.slice(1);
                
                // Add the active-text class to the current filter text for a style change
                currentFilterText.parentElement.classList.add('active-text');
                
                // Optionally, you can add a delay to remove the active-text class after a second or two
                setTimeout(() => {
                    currentFilterText.parentElement.classList.remove('active-text');
                }, 2000);
            });
        });
   
        





/*Classes.html */
// Filter classes by category
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function () {
        const filterValue = this.getAttribute('data-filter');
        const classes = document.querySelectorAll('.class-card');

        classes.forEach(classCard => {
            if (filterValue === 'all') {
                classCard.classList.remove('hidden');
            } else {
                if (classCard.classList.contains(filterValue)) {
                    classCard.classList.remove('hidden');
                } else {
                    classCard.classList.add('hidden');
                }
            }
        });
    });
});





// Blog data (can be extended, or fetched dynamically from a database)
const blogs = {
    1: {
        title: "Fitness Journey: From Beginner to Pro",
        content: `
            <p>This is the full content of the blog. It covers the entire fitness journey, 
            from starting as a beginner to becoming a pro athlete. It includes details on 
            workouts, nutrition, mindset, and challenges faced along the way.</p>
            <img src="images/blog1-full.jpg" alt="Full Blog 1" class="img-fluid">
            <p>Here is more information about the steps taken, the milestones reached, and 
            how this individual managed to overcome obstacles and improve their fitness 
            levels through dedication and hard work.</p>`,
        image: "images/blog1-full.jpg"
    },
    2: {
        title: "Top 5 Cardio Workouts to Boost Your Endurance",
        content: `
            <p>In this blog, we explore the top 5 cardio workouts that can significantly 
            boost your endurance, improve heart health, and help you burn fat more efficiently. 
            Whether you're a beginner or experienced athlete, these exercises will get your heart rate up and keep you fit.</p>
            <img src="images/blog2-full.jpg" alt="Full Blog 2" class="img-fluid">
            <p>Details of each workout are shared, including tips on how to perform them correctly 
            and the benefits they bring to your overall fitness journey.</p>`,
        image: "images/blog2-full.jpg"
    },
    3: {
        title: "Yoga for Mental and Physical Wellness",
        content: `
            <p>Yoga is more than just stretching. It’s a holistic approach to wellness that benefits 
            both your mind and body. In this blog, we discuss how yoga can help with flexibility, strength, 
            and mental clarity.</p>
            <img src="images/blog3-full.jpg" alt="Full Blog 3" class="img-fluid">
            <p>Learn about the different types of yoga, the various postures, and how incorporating yoga into 
            your daily routine can lead to a more balanced and healthy life.</p>`,
        image: "images/blog3-full.jpg"
    }
};

// Event listener for "Read More" button
document.addEventListener('DOMContentLoaded', function() {
    const readMoreButtons = document.querySelectorAll('.read-more');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const blogId = button.getAttribute('data-id');
            const blog = blogs[blogId];
            
            // Navigate to a new page or open a modal with full blog content
            window.location.href = `blog.html?id=${blogId}`;
        });
    });
});




/** BMI calculator */
// Open BMI Calculator Modal
document.getElementById('bmiCalculatorLink').addEventListener('click', function(event) {
    event.preventDefault();
    const bmiModal = new bootstrap.Modal(document.getElementById('bmiModal'));
    bmiModal.show();
});

// Handle BMI Calculation
document.getElementById('bmiForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the weight and height values
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    // Debug: Log weight and height to check values
    console.log(`Weight: ${weight}, Height: ${height}`);

    // Check if both weight and height are valid numbers
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        document.getElementById('result').innerHTML = 'Please enter valid values for both weight and height.';
        return;
    }

    // Calculate BMI
    const bmi = weight / (height * height);

    // Debug: Log the calculated BMI
    console.log(`Calculated BMI: ${bmi}`);

    // Determine the BMI category
    let resultMessage = `Your BMI is: ${bmi.toFixed(2)}`;

    if (bmi < 18.5) {
        resultMessage += '<br>You are underweight.';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        resultMessage += '<br>You have a normal weight.';
    } else if (bmi >= 25 && bmi < 29.9) {
        resultMessage += '<br>You are overweight.';
    } else {
        resultMessage += '<br>You are obese.';
    }

    // Display the result
    document.getElementById('result').innerHTML = resultMessage;
});





// Example form submission handler
document.getElementById('membershipForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    alert('Form submitted successfully!');
    // Here, you can add functionality to save the data or redirect the user
    // For example, use AJAX to send data to your server or Firebase
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData.entries())); // Logs form data
    try {
        const response = await fetch('http://127.0.0.1:5000/membership', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: Object.fromEntries(formData.entries())
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            // Reset the form or close the modal
            document.getElementById('membershipForm').reset();
            const modalElement = document.getElementById('membershipFormModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    } catch (error) {
        alert("An error occurred. Please try again later.");
    }
    e.target.reset(); // Reset the form
});

});


function setPlan(planName, planPrice) {
    // Get the input elements
    const planNameInput = document.getElementById("planName");
    const planPriceInput = document.getElementById("planPrice");

    // Set their values
    if (planNameInput && planPriceInput) {
        planNameInput.value = planName;
        planPriceInput.value = planPrice;
    } else {
        console.error("Form inputs not found in the DOM.");
    }
}


document.getElementById('membershipForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    
    const formData = {
        planName: document.getElementById('planName').value,
        planPrice: document.getElementById('planPrice').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };
    
    fetch('http://127.0.0.1:5000/membership', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);  // Display success message
            $('#membershipFormModal').modal('hide');  // Close modal on success
        } else if (data.error) {
            alert(data.error);  // Display error message
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form');
    });
});