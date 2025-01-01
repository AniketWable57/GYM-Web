document.addEventListener('DOMContentLoaded', () => {
    // Navbar Toggle
    const navbarMenu = document.querySelector('.navbar-menu');
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '☰';
    toggleButton.classList.add('navbar-toggle');
    document.querySelector('.navbar').appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        navbarMenu.classList.toggle('show');
    });

    // Filter Buttons Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update button active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update filter display text
            const filterValue = this.getAttribute('data-filter');
            
          

            // Filter class cards
            const classes = document.querySelectorAll('.class-card');
            classes.forEach(classCard => {
                if (filterValue === 'all' || classCard.classList.contains(filterValue)) {
                    classCard.classList.remove('hidden');
                } else {
                    classCard.classList.add('hidden');
                }
            });
        });
    });

    // Blog Read More Functionality
    const blogs = {
        1: {
            title: "Fitness Journey: From Beginner to Pro",
            content: `
                <p>This is the full content of the blog. It covers the entire fitness journey, 
                from starting as a beginner to becoming a pro athlete. It includes details on 
                workouts, nutrition, mindset, and challenges faced along the way.</p>
                <img src="images/blog1-full.jpg" alt="Full Blog 1" class="img-fluid">
                <p>Here is more information about the steps taken, milestones reached, and 
                overcoming obstacles to improve fitness levels through dedication and hard work.</p>`,
            image: "images/blog1-full.jpg"
        },
        2: {
            title: "Top 5 Cardio Workouts to Boost Your Endurance",
            content: `
                <p>In this blog, we explore the top 5 cardio workouts that can significantly 
                boost your endurance, improve heart health, and help you burn fat more efficiently.</p>
                <img src="images/blog2-full.jpg" alt="Full Blog 2" class="img-fluid">
                <p>Details of each workout are shared, including tips on how to perform them correctly 
                and the benefits they bring to your overall fitness journey.</p>`,
            image: "images/blog2-full.jpg"
        },
        3: {
            title: "Yoga for Mental and Physical Wellness",
            content: `
                <p>Yoga is more than just stretching. It’s a holistic approach to wellness that benefits 
                both your mind and body. Learn how yoga can improve flexibility, strength, and mental clarity.</p>
                <img src="images/blog3-full.jpg" alt="Full Blog 3" class="img-fluid">
                <p>Incorporating yoga into your daily routine can lead to a more balanced and healthy life.</p>`,
            image: "images/blog3-full.jpg"
        }
    };

    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const blogId = button.getAttribute('data-id');
            const blog = blogs[blogId];
            window.location.href = `blog.html?id=${blogId}`;
        });
    });

    // BMI Calculator
    document.getElementById('bmiCalculatorLink').addEventListener('click', function (event) {
        event.preventDefault();
        const bmiModal = new bootstrap.Modal(document.getElementById('bmiModal'));
        bmiModal.show();
    });

    document.getElementById('bmiForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            document.getElementById('result').innerHTML = 'Please enter valid values for weight and height.';
            return;
        }

        const bmi = weight / (height * height);
        let resultMessage = `Your BMI is: ${bmi.toFixed(2)}`;
        if (bmi < 18.5) resultMessage += '<br>You are underweight.';
        else if (bmi < 24.9) resultMessage += '<br>You have a normal weight.';
        else if (bmi < 29.9) resultMessage += '<br>You are overweight.';
        else resultMessage += '<br>You are obese.';
        document.getElementById('result').innerHTML = resultMessage;
    });

    document.getElementById('membershipForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = {
            plan_name: document.getElementById('plan_name').value,
            plan_price: document.getElementById('plan_price').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
        }; 
        
    
        try {
            const response = await fetch('http://localhost:5000/submit-membership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
            if (response.ok) {
                document.getElementById('membershipForm').reset();
                const membershipFormModal = document.getElementById('membershipFormModal');
                const formModalInstance = bootstrap.Modal.getInstance(membershipFormModal);
                formModalInstance.hide();
    
                // Show success modal
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    });
});    

// Function to Set Plan in Membership Form
function setPlan(planName, planPrice) {
    const planNameInput = document.getElementById('plan_name');
    const planPriceInput = document.getElementById('plan_price');
    if (planNameInput && planPriceInput) {
        planNameInput.value = planName;
        planPriceInput.value = planPrice;
    } else {
        console.error('Form inputs not found in the DOM.');
    }
}
